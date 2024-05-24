import { Request, Response } from "express";
import User from "../../models/User.js";

// Registration handler
export const postRegister = async (req: Request, res: Response): Promise<Response> => {
    const { username, email, password } = req.body;

    const user = await User.create({
        username: "soroosh",
        email: "soroosh@gmail.com",
        password: "password",
    });
    return res.send("user has been added");
};
