import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";

import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5514;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    return res.send("Hello!");
});

app.use("/api/auth", authRoutes);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`);
});
