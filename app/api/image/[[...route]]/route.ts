import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import cloudinary from '../../../../lib/cloudinary';
import connectMongoDB from '../../../../lib/mongodb';
import Image from '../../../../models/image';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get('prompt');
  const getAll = searchParams.get('all') === 'true';

  try {
    await connectMongoDB();

    // === Fetch All Images ===
    if (getAll) {
      const allImages = await Image.find({});
      return NextResponse.json(allImages);
    }

    // === Generate and Upload Image ===
    const finalPrompt = prompt || 'default prompt';
    console.log(`Generating image for prompt: "${finalPrompt}"`);

    const pollinationUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=800&height=800&seed=42&model=turbo&nologo=true&enhance=false`;
    const response = await axios.get(pollinationUrl, { responseType: 'arraybuffer' });

    if (response.status !== 200) {
      return NextResponse.json({ message: 'Failed to fetch image from Pollinations' }, { status: 500 });
    }

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', secure: true },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(response.data);
    });

    await Image.create({ url: uploadResult.secure_url, prompt: finalPrompt });
    return NextResponse.json({ imageUrl: uploadResult.secure_url });

  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    console.error('Error in GET /image:', error);
    return NextResponse.json({ message: 'Error processing request', error: error.message }, { status: 500 });
  }
}