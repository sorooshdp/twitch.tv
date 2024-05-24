import { Request, Response } from "express";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface LoginRequestBody {
    email: string;
    password: string;
}

interface User {
    _id: string;
    email: string;
    password?: string;
    username?: string;
}

export const postLogin = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (user && (await bcrypt.compare(password, user.password!))) {
            const token = jwt.sign(
                {
                    userId: user._id,
                    email: user.email,
                },
                process.env.TOKEN_KEY!,
                {
                    expiresIn: "8h",
                }
            );
            return res.status(200).json({
                userDetails: {
                    email: user.email,
                    token,
                    username: user.username,
                },
            });
        }
        return res.status(400).send("Invalid credentials. Please try again.");
    } catch (err) {
        console.error(err);
        return res.status(500).send("Something went wrong. Please try again.");
    }
};