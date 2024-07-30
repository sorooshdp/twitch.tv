import mongoose, { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { IChannel } from "../types/models";

const channelSchema = new Schema<IChannel>({
    isActive: { type: Boolean, default: false },
    title: { type: String, default: "channel title" },
    description: { type: String, default: "channel description" },
    avatarUrl: { type: String, default: "none" },
    thumbnailUrl: { type: String, default: "none" }, // New property for thumbnail URL
    streamKey: { type: String, default: uuid() },
    messages: {
        type: [{ type: Schema.Types.ObjectId, ref: "message" }],
        default: [],
    },
});

export default mongoose.model<IChannel>("Channel", channelSchema);
