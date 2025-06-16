import mongoose from 'mongoose';

const connectMongoDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('MongoDB connection failed');
  }
};

export default connectMongoDB;