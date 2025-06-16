import mongoose, { Schema, model, Model } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  profilePic: string;
  time: Date[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '/images/user.png' },
  time: [{ type: Date, default: Date.now }],
});

const User: Model<IUser> = mongoose.models.User || model<IUser>('User', userSchema);
export default User;