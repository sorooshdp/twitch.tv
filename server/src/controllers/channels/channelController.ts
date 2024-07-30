import { Request, Response } from "express";
import User from "../../models/User.js";
import Channel from "../../models/Channel.js";
import { ChannelData } from "../../types/models.js";
import { CustomeReq } from "../../types/auth.js";

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

        console.log("All users:" + users);

        const channels = users
            .filter((user) => user.channel)
            .map((user) => ({
                id: user.channel._id,
                title: user.channel.title,
                avatarUrl: user.channel.avatarUrl,
                thumbnailUrl : user.channel.thumbnailUrl,
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

        console.log(userId);
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
        console.error("Error in getChannelsSettings:", e);
        return res.status(500).send("Something went wrong on getChannels");
    }
};

/**
 * Updates channel settings for the authenticated user.
 *
 * @param {CustomeReq} req - The authenticated Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise that resolves to the response sent to the client.
 *
 * @throws {Error} If there's an issue updating channel settings.
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
            thumbnailUrl: channelData.thumbnailUrl
        });
    } catch (e) {
        console.error("Error from putChannelSettings:", e);
        return res.status(500).json({ error: "Something went wrong on putChannelSettings" });
    }
};

export const postFollowChannel = async (req: CustomeReq, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { userId } = req.user;
        const { channelId } = req.body;
        const userData = await User.findById(userId, { followingChannels: 1 });

        if (!userData) {
            return res.status(500).send("user not found!");
        }
        if (userData.followingChannels.includes(channelId)) {
            return res.status(400).send("you are already following this channel");
        }

        userData.followingChannels.push(channelId);

        await userData.save();

        return res.status(200).send("channel followed successfully");
    } catch (e) {
        console.log("error on postFollowChannel: " + e);
        res.status(500).send("somthing went wrong on postFollowChannel.");
    }
};

export const getFollowingChannels = async (req: CustomeReq, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { userId } = req.user;

        const user = await User.findById(userId).populate({
            path: "followingChannels",
            select: "isActive title description avatarUrl streamKey",
        });
        console.log("Populated user: ", user);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const followingChannels = user.followingChannels;

        console.log("following channels: ", followingChannels);

        return res.status(200).json({ followingChannels });
    } catch (e) {
        console.error("Something went wrong on getFollowingChannels: ", e);
        res.status(500).send("Something went wrong on getFollowingChannels");
    }
};
