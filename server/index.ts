import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5514;
const app = express();

app.use(express.json());

// Updated CORS configuration
app.use(cors({
  origin: 'https://localhost:5173', // or your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.get("/", (req, res) => {
    return res.send("Hello!");
});

// Handle OPTIONS requests
app.options('*', cors());

app.use("/api/auth", authRoutes);

const server = http.createServer(app);

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