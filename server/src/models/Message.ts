import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema({
    author: { type: String },
    content: { type: String },
    date: { type: Date },
});


export default mongoose.model("Message", messageSchema);