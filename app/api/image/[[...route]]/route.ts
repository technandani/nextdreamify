import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import cloudinary from '../../../../lib/cloudinary';
import connectMongoDB from '../../../../lib/mongodb';
import Image from '../../../../models/image';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get('prompt') || 'default prompt';

  try {
    await connectMongoDB();
    console.log(`Generating image for prompt: "${prompt}"`);

    const pollinationUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&seed=42&model=turbo&nologo=true&enhance=false`;
    const response = await axios.get(pollinationUrl, { responseType: 'arraybuffer' });

    if (response.status !== 200) {
      return NextResponse.json({ message: 'Failed to fetch image from Pollinations' }, { status: 500 });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', secure: true },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(response.data);
    });

    const newImage = await Image.create({ url: uploadResult.secure_url, prompt });
    return NextResponse.json({ imageUrl: uploadResult.secure_url });
  } catch (error) {
    console.error('Error generating or uploading image:', error);
    return NextResponse.json({ message: 'Error generating or uploading image' }, { status: 500 });
  }
}

export async function GET_ALL(req: NextRequest) {
  try {
    await connectMongoDB();
    const allUrls = await Image.find({});
    return NextResponse.json(allUrls);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ message: 'Error fetching images' }, { status: 500 });
  }
}