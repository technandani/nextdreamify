import mongoose, { Schema, model, Model } from 'mongoose';
import User from '@models/user'

interface IPost {
  user: mongoose.Types.ObjectId;
  url: string;
  prompt: string;
  visitingTime: Date[];
}

const postSchema = new Schema<IPost>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  prompt: { type: String, required: true },
  visitingTime: [{ type: Date, default: Date.now }],
});

const Post: Model<IPost> = mongoose.models.Post || model<IPost>('Post', postSchema);
export default Post;