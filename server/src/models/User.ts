import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/models";

const userSchema = new Schema<IUser>({
    username: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    channel: { type: Schema.Types.ObjectId, ref: "Channel" },
    followingChannels: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
});

export default mongoose.model<IUser>("User", userSchema);
