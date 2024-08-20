import express from "express";
import cors from "cors";
import https from "https";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import channelsRoutes from "./routes/channelsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import fs from "fs";
import { registerSocketServer } from "./io/io.js";
import User from "./models/User.js";
import Channel from "./models/Channel.js";
import Message from "./models/Message.js";

dotenv.config();

const PORT = process.env.PORT || 5514;
const app = express();

app.use(express.json());

app.use(cors({
  origin: 'https://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());

app.use("/api/auth", authRoutes);
app.use("/api/channels", channelsRoutes);
app.use("/api/settings", settingsRoutes);

const httpsOptions = {
    key: fs.readFileSync('./cert.key'),
    cert: fs.readFileSync('./cert.crt')
};

const server =  https.createServer(httpsOptions, app);

registerSocketServer(server);

mongoose
    .connect(process.env.MONGO_URL!)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`server is listening on ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("database connection failed. server didn't start.");
        console.log(err);
    });