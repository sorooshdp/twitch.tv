import express from "express";
import { verifyToken } from "../middlewares/validation.js";
import { getChannelsSettings, putChannelSettings } from "../controllers/channels/getChannelDetails.js";
import { patchChangePassword } from "../controllers/settings/patchChangePassword.js";

const router = express.Router();

router.get("/channel", verifyToken, getChannelsSettings);
router.put("/channel", verifyToken, putChannelSettings);
router.patch("/password", verifyToken, patchChangePassword)

export default router
