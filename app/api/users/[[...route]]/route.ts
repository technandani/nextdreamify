import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import cloudinary from '../../../../lib/cloudinary';
import connectMongoDB from '../../../../lib/mongodb';
import User from '@models/user';
import { upload } from '../../../../lib/multer';

const secret = process.env.JWT_SECRET as string;

// Middleware to handle file uploads
const runMiddleware = (req: NextRequest, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, {
      setHeader: () => {}, // No-op for NextResponse
      end: () => {}, // No-op for NextResponse
    }, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
};

export async function POST(req: NextRequest) {
  const { pathname } = new URL(req.url);

  if (pathname.includes('loginWithGoogle')) {
    try {
      await connectMongoDB();
      const { rowtoken } = await req.json();
      if (!rowtoken) {
        return NextResponse.json({ success: false, message: 'Token is missing' }, { status: 400 });
      }

      const { data: userFromGoogle } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${rowtoken}` },
      });

      if (!userFromGoogle) {
        return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
      }

      const { email, name, picture } = userFromGoogle;
      let profilePicUrl = picture || '/images/user.png';

      let user = await User.findOne({ email });
      if (!user) {
        const hashedPassword = await bcrypt.hash(name, 10);
        user = await User.create({ name, email, password: hashedPassword, profilePic: profilePicUrl });
      }

      const token = jwt.sign({ email: user.email, _id: user._id }, secret, { expiresIn: '120h' });
      return NextResponse.json({
        success: true,
        message: 'Login successful.',
        token,
        data: { email: user.email, name: user.name, profilePic: user.profilePic },
      });
    } catch (error) {
      console.error('Error during Google login:', error);
      return NextResponse.json({ success: false, message: 'Error during login', error: error.message }, { status: 500 });
    }
  }

  if (pathname.includes('register')) {
    try {
      await connectMongoDB();
      const formData = await req.formData();
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const file = formData.get('profilePic') as File | null;

      if (!name || !email || !password) {
        return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
      }

      if (password.length < 8) {
        return NextResponse.json({ success: false, message: 'Password must be at least 8 characters long.' }, { status: 400 });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ success: false, message: 'Email already in use.' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      let profilePicUrl = '/images/user.png';

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'users/profile_pics', resource_type: 'image', secure: true },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });
        profilePicUrl = uploadResult.secure_url;
      }

      const newUser = await User.create({ name, email, password: hashedPassword, profilePic: profilePicUrl });
      return NextResponse.json({
        success: true,
        message: 'User created successfully.',
        data: { name: newUser.name, email: newUser.email, profilePic: newUser.profilePic },
      });
    } catch (error) {
      console.error('Error during registration:', error);
      return NextResponse.json({ success: false, message: 'Error during registration.', error: error.message }, { status: 500 });
    }
  }

  if (pathname.includes('login')) {
    try {
      await connectMongoDB();
      const { email, password } = await req.json();
      if (!email || !password) {
        return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found. Please register first.' }, { status: 400 });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ success: false, message: 'Incorrect password.' }, { status: 400 });
      }

      const token = jwt.sign({ email: user.email, _id: user._id }, secret, { expiresIn: '120h' });
      return NextResponse.json({
        success: true,
        message: 'Login successful.',
        token,
        data: { email: user.email, name: user.name, profilePic: user.profilePic },
      });
    } catch (error) {
      console.error('Error during login:', error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Invalid route' }, { status: 404 });
}