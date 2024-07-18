import { Request } from "express";
import jwt from "jsonwebtoken";

export interface LoginRequestBody {
    email: string;
    password: string;
}

export interface SignupRequestBody {
    username: string;
    email: string;
    password: string;
}

export interface RegisterRequestBody {
    username: string;
    email: string;
    password: string;
}

export interface CustomeReq extends Request {
    user?: User;
}

export interface AuthRequest extends Request {
    user?: User | jwt.JwtPayload | string;
}
