import { Request, Response } from "express";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";

interface User {
    userId: string;
}

interface AuthRequest extends Request {
    user?: User;
}

export const patchChangePassword = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const { userId } = req.user;
        const { password, newPassword } = req.body;

        console.log("Attempting to change password for userId:", userId);
        console.log("Provided current password length:", password?.length);
        console.log("Provided new password length:", newPassword?.length);

        const userData = await User.findById(userId).select("+password");
        if (!userData) {
            console.log("User not found for userId:", userId);
            return res.status(404).json({ error: "User not found" });
        }

        if (!userData.password) {
            console.log("Password not defined for user:", userId);
            return res.status(401).json({ error: "Password not defined for this user" });
        }

        console.log("Stored hashed password:", userData.password);
        console.log("Stored hashed password length:", userData.password.length);

        // Log the first few characters of the provided password (for debugging only, remove in production)
        console.log("First 3 characters of provided password:", password.slice(0, 3));

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        console.log("Is password correct:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            // For debugging: try hashing the provided password and compare it to the stored hash
            const debugHash = await bcrypt.hash(password, 10);
            console.log("Debug: Hashed provided password:", debugHash);
            console.log("Debug: Does it match stored hash?", debugHash === userData.password);

            console.log("Invalid password attempt for user:", userId);
            return res.status(400).json({ error: "Invalid password. Please try again." });
        }

        const encryptedPass = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ _id: userId }, { password: encryptedPass });

        console.log("Password successfully changed for user:", userId);
        return res.status(200).json({ message: "Password changed successfully" });
    } catch (e: any) {
        console.error("Error in patchChangePassword:", e);
        return res.status(500).json({ error: "Something went wrong on patchChangePassword", details: e.message });
    }
};
