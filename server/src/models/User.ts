import mongoose, { Document, Model, Schema } from "mongoose";
import { IChannel } from "./Channel";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    channel: mongoose.Types.ObjectId | IChannel;
    followingChannels: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
    username: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    channel: { type: Schema.Types.ObjectId, ref: "Channel" },
    followingChannels: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
});

export default mongoose.model<IUser>("User", userSchema);
