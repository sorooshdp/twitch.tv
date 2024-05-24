import { Request, Response } from "express";

// Login handler
export const postLogin = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    // Handle login logic here
    return res.send("Login successful");
};