import { NextFunction } from "express";
import express from "express";

export function customCors(
    req: express.Request,
    res: express.Response,
    next: NextFunction
) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true"); 
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }
    next();
}