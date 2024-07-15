import express from "express";
import { verifyToken } from "../middlewares/validation.js";
import { getChannelsSettings, putChannelSettings } from "../controllers/channels/getChannelDetails.js";

const router = express.Router();

router.get("/channel", verifyToken, getChannelsSettings);
router.put("/channel", verifyToken, putChannelSettings);

export default router
