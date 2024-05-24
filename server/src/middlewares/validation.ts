import { Request, Response, NextFunction } from "express";

// Custom middleware to validate registration data using regex
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    const usernameRegex = /^[a-zA-Z0-9_]+$/; // Alphanumeric usernames with underscores
    const passwordRegex = /^.{6,}$/; // Password must be at least 6 characters long

    if (!username || typeof username !== 'string' || !usernameRegex.test(username)) {
        return res.status(400).json({ error: "Username is required and must be alphanumeric" });
    }
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
        return res.status(400).json({ error: "A valid email is required" });
    }
    if (!password || typeof password !== 'string' || !passwordRegex.test(password)) {
        return res.status(400).json({ error: "Password is required and must be at least 6 characters long" });
    }
    next();
};

// Custom middleware to validate login data using regex
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    const passwordRegex = /^.{6,}$/; // Password must be at least 6 characters long

    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
        return res.status(400).json({ error: "A valid email is required" });
    }
    if (!password || typeof password !== 'string' || !passwordRegex.test(password)) {
        return res.status(400).json({ error: "Password is required and must be at least 6 characters long" });
    }
    next();
};
