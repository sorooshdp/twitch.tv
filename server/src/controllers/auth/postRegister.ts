import { Request, Response } from "express";

export const postRegister = async (req: Request, res: Response): Promise<Response> => {
    return res.send("this is register");
};
