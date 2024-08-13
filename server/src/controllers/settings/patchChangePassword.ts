import { Request, Response } from "express";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../../types/auth.js";

export const patchChangePassword = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { userId } = req.user;
        const { password, newPassword } = req.body;


        const userData = await User.findById(userId).select("+password");
        if (!userData) {
            console.log("User not found for userId:", userId);
            return res.status(404).json({ error: "User not found" });
        }

        if (!userData.password) {
            console.log("Password not defined for user:", userId);
            return res.status(401).json({ error: "Password not defined for this user" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            console.log("Invalid password attempt for user:", userId);
            return res.status(400).json({ error: "Invalid password. Please try again." });
        }

        const encryptedPass = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ _id: userId }, { password: encryptedPass });

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (e: any) {
        console.error("Error in patchChangePassword:", e);
        return res.status(500).json({ error: "Something went wrong on patchChangePassword", details: e.message });
    }
};
