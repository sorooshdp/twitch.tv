import { channel } from "diagnostics_channel";
import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    channel: { type: Schema.Types.ObjectId, ref: "Channel" },
    followingChannels: { type: [{ type: Schema.Types.ObjectId, ref: "Channel" }] },
});

export default mongoose.model("User", userSchema);
