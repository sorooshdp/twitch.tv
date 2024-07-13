import { Request, Response } from "express";

export const getChannelDetails = async (req : Request, res: Response) => {
    return res.status(200).json({
        id: 1,
        title: "channel",
        description: "description",
        username: "sor",
        isOnline: false,
        streamUrl: "http",
    });
};
