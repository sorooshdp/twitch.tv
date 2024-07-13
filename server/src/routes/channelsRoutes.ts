import express from "express";
import { validateChannelId } from "../middlewares/validation.js";
import { getChannelDetails } from "../controllers/controllers.js";


const router = express.Router();

router.get("/:channelId", getChannelDetails);

export default router;