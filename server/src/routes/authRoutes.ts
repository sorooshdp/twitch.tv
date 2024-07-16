import express from "express";
import { postLogin } from "../controllers/auth/postLogin";
import { postSignup } from "../controllers/auth/postSignup";
import { validateRegister, validateLogin } from "../middlewares/validation.js";

const router = express.Router();

router.post("/signup", validateRegister, postSignup);
router.post("/login", validateLogin, postLogin);

export default router;
