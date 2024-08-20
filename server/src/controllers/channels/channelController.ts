import { Request, Response } from "express";
import User from "../../models/User.js";
import Channel from "../../models/Channel.js";
import { ChannelData } from "../../types/models.js";
import { CustomeReq } from "../../types/auth.js";

const STREAM_URL_BASE = "http://localhost:8000/live/";

/**
 * Handles errors by logging them and sending a response to the client.
 *
 * @param {Response} res - The Express response object.
 * @param {any} error - The error object.
 * @param {string} message - The error message.
 * @returns {Response} The response sent to the client.
 */
const handleError = (res: Response, error: any, message: string): Response => {
    console.error(`Error in ${message}:`, error);
    return res.status(500).json({ error: `Something went wrong in ${message}` });
};

/**
 * Retrieves details for a specific channel.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves to the response sent to the client.
 */
export const getChannelDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { channelId } = req.params;

        if (!channelId) {
            return res.status(400).json({ error: "Channel ID is required" });
        }

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ error: "Channel not found" });
        }

        const user = await User.findOne({ channel: channelId }, { username: 1 });
        if (!user) {
            return res.status(404).json({ error: "User associated with this channel not found" });
        }

        return res.status(200).json({
            id: channel._id,
            title: channel.title,
            avatarUrl: channel.avatarUrl,
            description: channel.description,
            username: user.username,
            isOnline: false, 
            streamKey: channel.streamKey,
            streamUrl: `${STREAM_URL_BASE}${channel.streamKey}.flv`,
        });
    } catch (error) {
        console.error("Error in getChannelDetails:", error);
        return res.status(500).json({ error: "An unexpected error occurred while fetching channel details" });
    }
};

/**
 * Retrieves a list of all channels.
 *
 * @param {Request} _ - The Express request object (unused).
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves to the response sent to the client.
 */
export const getChannels = async (_: Request, res: Response): Promise<Response> => {
    try {
        const users = await User.find({}, { channel: 1, username: 1 }).populate<{ channel: ChannelData & Document }>(
            "channel"
        );

        const channels = await Promise.all(
            users
                .filter((user) => user.channel)
                .map(async (user) => ({
                    id: user.channel._id,
                    title: user.channel.title,
                    avatarUrl: user.channel.avatarUrl,
                    thumbnailUrl: user.channel.thumbnailUrl,
                    username: user.username,
                    isOnline: false,
                }))
        );

        return res.json(channels);
    } catch (e) {
        return handleError(res, e, "getChannels");
    }
};

/**
 * Retrieves channel settings for the authenticated user.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves to the response sent to the client.
 */
export const getChannelsSettings = async (req: Request, res: Response): Promise<Response> => {
    try {
        const authReq = req as CustomeReq;
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

        return res.status(200).json({
            id: userData?.channel._id,
            username: userData.username,
            title: userData?.channel.title,
            description: userData?.channel.description,
            avatarUrl: userData?.channel.avatarUrl,
            thumbnailUrl: userData.channel.thumbnailUrl,
            streamKey: userData?.channel.streamKey,
        });
    } catch (e) {
        return handleError(res, e, "getChannelsSettings");
    }
};

/**
 * Updates channel settings for the authenticated user.
 *
 * @param {CustomeReq} req - The authenticated Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves to the response sent to the client.
 */
export const putChannelSettings = async (req: CustomeReq, res: Response): Promise<Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { userId } = req.user;
        const { title, description, username, avatarUrl, thumbnailUrl } = req.body;

        if (!userId || typeof userId !== "string") {
            return res.status(400).json({ error: "Invalid userId" });
        }

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
                thumbnailUrl,
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
            thumbnailUrl: channelData.thumbnailUrl,
        });
    } catch (e) {
        return handleError(res, e, "putChannelSettings");
    }
};

/**
 * Follows a channel for the authenticated user.
 *
 * @param {CustomeReq} req - The authenticated Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves to the response sent to the client.
 */
export const postFollowChannel = async (req: CustomeReq, res: Response): Promise<Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { userId } = req.user;
        const { channelId } = req.body;
        const userData = await User.findById(userId, { followingChannels: 1 });

        if (!userData) {
            return res.status(500).send("User not found!");
        }
        if (userData.followingChannels.includes(channelId)) {
            return res.status(400).send("You are already following this channel");
        }

        userData.followingChannels.push(channelId);
        await userData.save();

        return res.status(200).send("Channel followed successfully");
    } catch (e) {
        return handleError(res, e, "postFollowChannel");
    }
};

/**
 * Unfollows a channel for the authenticated user.
 *
 * @param {CustomeReq} req - The authenticated Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves to the response sent to the client.
 */
export const unfollowChannel = async (req: CustomeReq, res: Response): Promise<Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { userId } = req.user;
        const { channelId } = req.body;

        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        const channelIndex = userData.followingChannels.indexOf(channelId);

        if (channelIndex === -1) {
            return res.status(400).json({ error: "You are not following this channel" });
        }

        userData.followingChannels.splice(channelIndex, 1);
        await userData.save();

        return res.status(200).json({ message: "Channel unfollowed successfully" });
    } catch (e) {
        return handleError(res, e, "unfollowChannel");
    }
};

/**
 * Retrieves the list of channels followed by the authenticated user.
 *
 * @param {CustomeReq} req - The authenticated Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves to the response sent to the client.
 */
export const getFollowingChannels = async (req: CustomeReq, res: Response): Promise<Response> => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { userId } = req.user;

        const user = await User.findById(userId).populate({
            path: "followingChannels",
            select: "isActive title description avatarUrl streamKey",
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const followingChannels = user.followingChannels;

        return res.status(200).json({ followingChannels });
    } catch (e) {
        return handleError(res, e, "getFollowingChannels");
    }
};
