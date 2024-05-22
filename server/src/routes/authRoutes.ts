import express from "express";
import { postLogin, postRegister } from "../controllers/controllers.js";

const router = express.Router();

router.get("/register", postRegister);

router.get("/login", postLogin);

export default router;
