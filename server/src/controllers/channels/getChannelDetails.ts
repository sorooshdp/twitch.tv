import { Request, Response, NextFunction } from "express";
import User from "../../models/User.js";
import Channel from "../../models/Channel.js";

/**
 * Represents a user with a userId.
 */
interface User {
    userId: string;
}

/**
 * Extends the Express Request interface to include an optional user property.
 */
interface AuthRequest extends Request {
    user?: User;
}

/**
 * Represents the structure of channel data returned from the database.
 */
interface ChannelData {
    _id: string;
    title: string;
    avatarUrl: string;
    isActive: boolean;
}

/**
 * Retrieves details for a specific channel.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves to the response sent to the client.
 * 
 * @throws {Error} If there's an issue retrieving channel details.
 */
export const getChannelDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { channelId } = req.params;
        const channel = await Channel.findById(channelId);

        if (!channel) {
            return res.status(404).send("Channel not found");
        }

        const user = await User.findOne({ channel: channelId }, { username: 1 });
        const streamUrl = "http"; // TODO: Implement dynamic stream URL generation
        const isOnline = false; // TODO: Implement real-time online status checking

        return res.status(200).json({
            id: channel._id,
            title: channel.title,
            description: channel.description,
            username: user?.username,
            isOnline,
            streamUrl,
        });
    } catch (e) {
        console.error("Error in getChannelDetails:", e);
        return res.status(500).send("Something went wrong on getChannelDetails");
    }
};

/**
 * Retrieves a list of all channels.
 * 
 * @param {Request} _ - The Express request object (unused).
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves to the response sent to the client.
 * 
 * @throws {Error} If there's an issue fetching channels.
 */
export const getChannels = async (_: Request, res: Response): Promise<Response> => {
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
                isOnline: false, // TODO: Implement real-time online status checking
            }));

        return res.json(channels);
    } catch (e) {
        console.error("Error fetching channels:", e);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Retrieves channel settings for the authenticated user.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 * @returns {Promise<Response>} A promise that resolves to the response sent to the client.
 * 
 * @throws {Error} If there's an issue retrieving channel settings.
 */
export const getChannelsSettings = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.userId;

        if (!userId) {
            return res.status(401).send("User not authenticated");
        }

        const userData = await User.findById(userId, {
            channel: 1,
            username: 1,
        }).populate("channel");

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
        console.error("Error in getChannelsSettings:", e);
        return res.status(500).send("Something went wrong on getChannels");
    }
};

/**
 * Updates channel settings for the authenticated user.
 * 
 * @param {AuthRequest} req - The authenticated Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 * @returns {Promise<Response>} A promise that resolves to the response sent to the client.
 * 
 * @throws {Error} If there's an issue updating channel settings.
 */
export const putChannelSettings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response> => {
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
