import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import cloudinary from "../../../../lib/cloudinary";
import connectMongoDB from "../../../../lib/mongodb";
import Image from "../../../../models/image";
import { CloudinaryUploadResult } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get("prompt");
  const getAll = searchParams.get("all") === "true";
  const width = searchParams.get("width") || "800";
  const height = searchParams.get("height") || "800";

  try {
    await connectMongoDB();

    // === Fetch All Images ===
   if (getAll) {
  const allImages = await Image.find({}).lean();
  const reversedImages = allImages.reverse(); // Reverse client-side
  console.log(`Fetched ${reversedImages.length} images.`);
  return NextResponse.json(reversedImages);
}

    // === Generate and Upload Image ===
    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt is required" },
        { status: 400 }
      );
    }

    const style = searchParams.get("style") || "default";

    const finalPrompt = style === "default" ? prompt : `${prompt}, ${style}`;

    console.log(
      `Generating image for prompt: "${finalPrompt}" with width: ${width}, height: ${height}`
    );
    const pollinationUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      finalPrompt
    )}?width=${width}&height=${height}&seed=42&model=turbo&nologo=true&enhance=false`;

    const response = await axios.get(pollinationUrl, {
      responseType: "arraybuffer",
    });

    if (response.status !== 200) {
      console.error(
        "Pollinations API error:",
        response.status,
        response.statusText
      );
      return NextResponse.json(
        { message: "Failed to fetch image from Pollinations" },
        { status: 500 }
      );
    }

    const uploadResult: CloudinaryUploadResult = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image", secure: true },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );
        uploadStream.end(response.data);
      }
    );

    await Image.create({ url: uploadResult.secure_url, prompt: finalPrompt });
    return NextResponse.json({ imageUrl: uploadResult.secure_url });
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    console.error("GET /api/image error:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: "Error processing request", error: error.message },
      { status: 500 }
    );
  }
}
