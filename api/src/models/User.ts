import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
  plays: number;
  prizes: string[];
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plays: { type: Number, default: 0 },
    prizes: { type: [String], default: [] },
  },
  { collection: "users" }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
