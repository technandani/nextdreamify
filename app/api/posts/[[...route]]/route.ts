import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import connectMongoDB from "@/lib/mongodb";
import Post from "@models/post";
import User from "@models/user";

const secret = process.env.JWT_SECRET as string;

interface MyJwtPayload extends JwtPayload {
  _id: string;
}

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

    let decoded: MyJwtPayload;
    try {
      const verified = jwt.verify(token, secret);
      if (typeof verified === "string" || !("_id" in verified)) {
        return NextResponse.json(
          { success: false, message: "Invalid token payload." },
          { status: 401 }
        );
      }
      decoded = verified as MyJwtPayload;
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

    const user = await User.findById(decoded._id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
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
    console.error("POST /api/posts error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? error instanceof Error ? error.message : "Internal server error."
            : "Internal server error.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    console.log("Fetching posts from MongoDB...");
    const posts = await Post.find({})
      .sort({ _id: -1 })
      .populate({
        path: "user",
        select: "name profilePic",
        model: User,
      })
      .lean();
    console.log(`Fetched ${posts.length} posts.`);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/posts error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
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