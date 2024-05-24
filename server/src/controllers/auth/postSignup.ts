import { Request, Response } from "express";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface SignupRequestBody {
    username: string;
    email: string;
    password: string;
}

interface User {
    _id: string;
    email: string;
    username: string;
    password?: string;
}

export const postSignup = async (req: Request<{}, {}, SignupRequestBody>, res: Response): Promise<Response> => {
    try {
        const { username, email, password } = req.body;
        const userExists = await User.exists({ email });

        if (userExists) {
            return res.status(409).send("Email already exists.");
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

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
        return res.status(201).json({
            userDetails: {
                email: user.email,
                token,
                username: user.username,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Please try again.");
    }
};
