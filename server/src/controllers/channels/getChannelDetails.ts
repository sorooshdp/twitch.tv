import { Request, Response, NextFunction } from "express";
import User from "../../models/User.js";
import Channel from "../../models/Channel.js";
interface User {
    userId: string;
}
interface AuthRequest extends Request {
    user?: User;
}
interface ChannelData {
    _id: string;
    title: string;
    avatarUrl: string;
    isActive: boolean;
}

export const getChannelDetails = async (req: Request, res: Response) => {
    try {
        const { channelId } = req.params;
        const channel = await Channel.findById(channelId);

        if (!channel) {
            return res.status(404).send(" channel not found ");
        }

        const user = await User.findOne({ channel: channelId }, { username: 1 });
        const streamUrl = "http";
        const isOnline = false;

        return res.status(200).json({
            id: channel._id,
            title: channel.title,
            description: channel.description,
            username: user?.username,
            isOnline,
            streamUrl,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send(" somthing went wrong on getChannelDetails");
    }
};

export const getChannels = async (_: Request, res: Response) => {
    try {
        const users = await User.find({}, { channel: 1, username: 1 }).populate<{ channel: ChannelData & Document }>(
            "channel"
        );

        console.log(users);

        const channels = users
            .filter((user) => user.channel)
            .map((user) => ({
                id: user.channel._id,
                title: user.channel.title,
                avatarUrl: user.channel.avatarUrl,
                username: user.username,
                isOnline: false,
            }));

        res.json(channels);
    } catch (e) {
        console.error("Error fetching channels:", e);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getChannelsSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.userId;

        const userData = await User.findById(userId, {
            channel: 1,
            username: 1,
        }).populate("channel");

        if (!userId) {
            return res.status(401).send("User not authenticated");
        }

        if (!userData?.channel || !("title" in userData.channel)) {
            return res.status(404).send("Channel not found");
        }

        console.log(userId);
        return res.status(200).json({
            id: userData?.channel._id,
            username: userData.username,
            title: userData?.channel.title,
            description: userData?.channel.description,
            avatarUrl: userData?.channel.avatarUrl,
            streamKey: userData?.channel.streamKey,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send("Something went wrong on getChannels");
    }
};

export const putChannelSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);

        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        
        const { userId } = req.user;
        const { title, description, username, avatarUrl } = req.body;

        if (!userId || typeof userId !== "string") {
            return res.status(400).json({ error: "Invalid userId" });
        }

        console.log("user id: " + userId);

        const userData = await User.findById(userId).select("username channel");

        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        if (userData.username !== username) {
            await User.findByIdAndUpdate(userId, { username });
        }

        if (!userData.channel) {
            return res.status(404).json({ error: "Channel not found for this user" });
        }

        const channelData = await Channel.findByIdAndUpdate(
            userData.channel,
            {
                title,
                description,
                avatarUrl,
                isActive: true,
            },
            { new: true }
        );

        if (!channelData) {
            return res.status(404).json({ error: "Channel not found" });
        }

        return res.status(200).json({
            channelId: channelData._id,
            username,
            title: channelData.title,
            description: channelData.description,
            avatarUrl: channelData.avatarUrl,
        });
    } catch (e) {
        console.error("Error from putChannelSettings:", e);
        return res.status(500).json({ error: "Something went wrong on putChannelSettings" });
    }
};
