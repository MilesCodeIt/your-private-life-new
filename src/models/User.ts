import mongoose from "mongoose";

export interface IUser {
  username: string;
  password: string;
  email: string;

  levels: Map<string, boolean>
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },

  levels: { type: Map, of: Boolean, required: true }
});

export default (
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
) as mongoose.Model<IUser>;