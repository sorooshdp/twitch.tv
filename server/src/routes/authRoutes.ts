import express from "express";
import { postLogin } from "../controllers/auth/postLogin.js";
import { postSignup } from "../controllers/auth/postSignup.js";
import { validateRegister, validateLogin } from "../middlewares/validation.js";

const router = express.Router();

router.post("/signup", validateRegister, postSignup);
router.post("/login", validateLogin, postLogin);

export default router;
