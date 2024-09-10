import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import channelsRoutes from "./routes/channelsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import { registerSocketServer } from "./io/io.js";
import User from "./models/User.js";
import Channel from "./models/Channel.js";
import Message from "./models/Message.js";
import { customCors } from "./middlewares/cors.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "https://twitch-tv-seven.vercel.app",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Access-Control-Allow-Headers, content-type, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization",
        ],
        credentials: true,
    })
);
// app.use(customCors);
app.options("*", cors());

app.use("/api/auth", authRoutes);
app.use("/api/channels", channelsRoutes);
app.use("/api/settings", settingsRoutes);

const server = http.createServer(app);

registerSocketServer(server);

mongoose
    .connect(process.env.MONGO_URL!)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Database connection failed.");
        console.error(err);
    });

const PORT = process.env.PORT || 5514;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
