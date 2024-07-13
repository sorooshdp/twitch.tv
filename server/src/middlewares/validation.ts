import { Request, Response, NextFunction } from "express";

interface RegisterRequestBody {
    username: string;
    email: string;
    password: string;
}

interface LoginRequestBody {
    email: string;
    password: string;
}

const emailRegex = /\S+@\S+\.\S+/;
const usernameRegex = /^[a-zA-Z0-9_]+$/;
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

    if ( typeof channelId != "string") {
        res.status(400).json({ error: "channel id is not valid!" });
        return;
    }

    next();
};
