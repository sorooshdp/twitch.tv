import { Request, Response } from "express";

export const postLogin = async (req: Request, res: Response): Promise<Response> => {
    return res.send(" this is login");
};
