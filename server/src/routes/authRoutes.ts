import express from "express";
import { postLogin, postSignup } from "../controllers/controllers.js";
import { validateRegister, validateLogin } from "../middlewares/validation.js";

const router = express.Router();

router.post("/signup", validateRegister, postSignup);
router.post("/login", validateLogin, postLogin);

export default router;
