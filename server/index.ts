import express from "express";
import cors from "cors";
import https from "https"
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./src/routes/authRoutes.js";
import channelsRoutes from "./src/routes/channelsRoutes.js";
import fs from "fs";

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

app.get("/", (req, res) => {
    return res.send("Hello!");
});

app.options('*', cors());

app.use("/api/auth", authRoutes);
app.use("/api/channels", channelsRoutes);

const httpsOptions = {
    key: fs.readFileSync('./cert.key'),
    cert: fs.readFileSync('./cert.crt')
};

const server =  https.createServer(httpsOptions, app);

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