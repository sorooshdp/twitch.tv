import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, LoginRequestBody, RegisterRequestBody } from "../types/auth";
const config = process.env;

const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /^.{6,}$/;

export const validateRegister = (
    req: Request<{}, {}, RegisterRequestBody>,
    res: Response,
    next: NextFunction
): void => {
    const { username, email, password } = req.body;
    console.log("info on validator: " + username + "   " + email + "  " + password);

    if (!username || typeof username !== "string") {
        console.log("err on username");
        res.status(400).json({ error: "Username is required and must be alphanumeric." });
        return;
    }
    if (!email || typeof email !== "string" || !emailRegex.test(email)) {
        console.log("err on email");
        res.status(400).json({ error: "A valid email is required." });
        return;
    }
    if (!password || typeof password !== "string" || !passwordRegex.test(password)) {
        console.log("err on pass");
        res.status(400).json({ error: "Password is required and must be at least 6 characters long." });
        return;
    }
    next();
};

export const validateLogin = (req: Request<{}, {}, LoginRequestBody>, res: Response, next: NextFunction): void => {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || !emailRegex.test(email)) {
        res.status(400).json({ error: "A valid email is required." });
        return;
    }
    if (!password || typeof password !== "string" || !passwordRegex.test(password)) {
        res.status(400).json({ error: "Password is required and must be at least 6 characters long." });
        return;
    }
    next();
};

export const validateChannelId = (req: Request<{}, {}>, res: Response, next: NextFunction): void => {
    const { channelId } = req.body;

    if (typeof channelId != "string") {
        res.status(400).json({ error: "channel id is not valid!" });
        return;
    }

    next();
};

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("in verifyToken")
    let token = req.body.token || req.query.token || req.header("Authorization");

    if (!token) {
        console.log("token not found!");
        res.status(401).send("you should provide the token for auth");
    }

    try {
        console.log(token);
        token = token.replace(/^Bearer\s+/, "");
        const decoded = jwt.verify(token, config.TOKEN_KEY!);
        console.log("Decoded token:", decoded);

        req.user = decoded;
    } catch (error) {
        return res.status(401).send("invalid token");
    }

    next();
};
