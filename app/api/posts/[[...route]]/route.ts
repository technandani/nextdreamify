import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectMongoDB from "@/lib/mongodb";
import Post from "@models/post"; 

const secret = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "User not logged in. Token missing." },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid token.";
      return NextResponse.json({ success: false, message }, { status: 401 });
    }

    const { url, prompt } = await req.json();
    if (!url || !prompt) {
      return NextResponse.json(
        { success: false, message: "URL and prompt are required." },
        { status: 400 }
      );
    }

    const newPost = await Post.create({
      user: decoded._id,
      url,
      prompt,
      visitingTime: [new Date()],
    });

    return NextResponse.json({
      success: true,
      message: "Post created successfully.",
      post: newPost,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : "Internal server error.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const posts = await Post.find({})
      .sort({ _id: -1 })
      .populate("user", "name profilePic");
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Server error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error.";
    return NextResponse.json(
      {
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? message
            : "Internal server error.",
      },
      { status: 500 }
    );
  }
}
