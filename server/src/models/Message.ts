import mongoose from "mongoose";
import { IMessage } from "../types/models";

const { Schema } = mongoose;

const messageSchema = new Schema<IMessage>({
    author: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>("Message", messageSchema);