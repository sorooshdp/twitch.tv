import mongoose from "mongoose";
export interface User {
    _id: string;
    username: string;
    email: string;
    password?: string;
    userId?: string;
}

interface IMessage extends Document {
    author: string;
    content: string;
    date: Date;
}

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    channel: mongoose.Types.ObjectId | IChannel;
    followingChannels: mongoose.Types.ObjectId[];
}

interface IChannel extends Document {
    _id: string;
    isActive: boolean;
    title: string;
    description: string;
    avatarUrl: string;
    thumbnailUrl: string;
    streamKey: string;
    messages: IMessage[];
}

interface ChannelData {
    _id: string;
    title: string;
    avatarUrl: string;
    thumbnailUrl: string;
    streamKey: string;
    isActive: boolean;
}
