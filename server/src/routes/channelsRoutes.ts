import express from "express";
import { validateChannelId } from "../middlewares/validation.js";
import { getChannelDetails, getChannels } from "../controllers/controllers.js";

const router = express.Router();

router.get("/:channelId", getChannelDetails);
router.get("/", getChannels);

export default router;
