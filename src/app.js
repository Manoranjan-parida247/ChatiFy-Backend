// const express = require('express');
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit";
import messageRoutes from "./routes/message.route.js"

dotenv.config();
const app = express();

const limiter = rateLimit({
    windowMs: 60 * 1000, //1 minute in ms
    max: 15,
    message: "Request limit exceed"
})


const PORT = process.env.PORT || 3000;
app.use(limiter);
app.use(express.json())
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

connectDB().then(() => {
    console.log("Database connected successfully!")
    app.listen(PORT, () => console.log("server is running on PORT " + PORT));
}).catch((err) => {
    console.log("Database can not be connected...." + err.meassage);
    process.exit(1);
})