// const express = require('express');
import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit";
import messageRoutes from "./routes/message.route.js"
import cors from "cors"
import { app, server } from "./lib/socket.js";
dotenv.config();


const limiter = rateLimit({
    windowMs: 60 * 1000, //1 minute in ms
    max: 30,
    message: "Request limit exceed"
})


const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}
))
app.use(limiter);
app.use(express.json({ limit: "15mb" }))
app.use(express.urlencoded({extended: true, limit: "15mb"}));//form bodies
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

connectDB().then(() => {
    console.log("Database connected successfully!")
    server.listen(PORT, () => console.log("server is running on PORT " + PORT));
}).catch((err) => {
    console.log("Database can not be connected...." + err.meassage);
    process.exit(1);
})