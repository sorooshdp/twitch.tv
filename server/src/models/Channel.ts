import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuid } from "uuid";

export interface IChannel extends Document {
    isActive: boolean;
    title: string;
    description: string;
    avatarUrl: string;
    streamKey: string;
    messages: mongoose.Types.ObjectId[];
}

const channelSchema = new Schema<IChannel>({
    isActive: { type: Boolean, default: false },
    title: { type: String, default: "channel title" },
    description: { type: String, default: "channel description" },
    avatarUrl: { type: String, default: "none" },
    streamKey: { type: String, default: uuid() },
    messages: {
        type: [{ type: Schema.Types.ObjectId, ref: "message" }],
        default: [],
    },
});

export default mongoose.model<IChannel>("Channel", channelSchema);
