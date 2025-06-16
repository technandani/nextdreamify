import mongoose, { Schema, model, Model } from 'mongoose';

interface IImage {
  url: string;
  prompt: string;
}

const imageSchema = new Schema<IImage>({
  url: { type: String, required: true },
  prompt: { type: String, required: true },
});

const Image: Model<IImage> = mongoose.models.Image || model<IImage>('Image', imageSchema);
export default Image;