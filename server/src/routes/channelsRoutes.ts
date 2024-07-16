import express from "express";
import { getChannelDetails, getChannels } from "../controllers/channels/getChannelDetails";

const router = express.Router();

router.get("/:channelId", getChannelDetails);
router.get("/", getChannels);

export default router;
