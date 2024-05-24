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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_]+$/;
const passwordRegex = /^.{6,}$/;

export const validateRegister = (req: Request<{}, {}, RegisterRequestBody>, res: Response, next: NextFunction): void => {
    const { username, email, password } = req.body;

    if (!username || typeof username !== 'string' || !usernameRegex.test(username)) {
        res.status(400).json({ error: "Username is required and must be alphanumeric." });
        return;
    }
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
        res.status(400).json({ error: "A valid email is required." });
        return;
    }
    if (!password || typeof password !== 'string' || !passwordRegex.test(password)) {
        res.status(400).json({ error: "Password is required and must be at least 6 characters long." });
        return;
    }
    next();
};

export const validateLogin = (req: Request<{}, {}, LoginRequestBody>, res: Response, next: NextFunction): void => {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
        res.status(400).json({ error: "A valid email is required." });
        return;
    }
    if (!password || typeof password !== 'string' || !passwordRegex.test(password)) {
        res.status(400).json({ error: "Password is required and must be at least 6 characters long." });
        return;
    }
    next();
};