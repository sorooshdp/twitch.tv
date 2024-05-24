import express from "express";
import { postLogin, postRegister } from "../controllers/controllers.js";
import { validateRegister, validateLogin } from "../middlewares/validation.js";
const router = express.Router();
router.post("/register", validateRegister, postRegister);
router.post("/login", validateLogin, postLogin);
export default router;
