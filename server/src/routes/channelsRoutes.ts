import express from "express";
import {
    getChannelDetails,
    getChannels,
    getFollowingChannels,
    postFollowChannel,
} from "../controllers/channels/channelController.js";
import { verifyToken } from "../middlewares/validation.js";

const router = express.Router();

router.get("/following", verifyToken, getFollowingChannels);
router.post("/follow", verifyToken, postFollowChannel);
router.get("/:channelId", getChannelDetails);
router.get("/", getChannels);

export default router;
