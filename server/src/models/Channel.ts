import mongoose, { mongo } from "mongoose";
import { v4 as uuid } from "uuid";

const { Schema } = mongoose;

const channelSchema = new Schema({
    isActive: { type: Boolean, default: false},
    title: { type: String, default: "channel title"},
    description: { type: String, default: "channel description"},
    avatarUrl: { type: String, default: "none"},
    streamKey: { type: String, default: uuid()},
    messages: { 
        type: [{ type: Schema.Types.ObjectId, ref: "message"}],
        default: [],
    },
})

export default mongoose.model("Channel", channelSchema);