import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./Routes/Authroute.js";
import contactsRoutes from "./Routes/ContactRoutes.js";
import setupSocket from "./socket.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9999;
const databaseURL = process.env.DATABASE_URL;
const allowedOrigins = process.env.ORIGIN.split(",");


const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

setupSocket(server)


mongoose
  .connect(databaseURL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

  app.use(cors({
    origin: process.env.ORIGIN,  // ✅ Use the correct environment variable
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }));
  
  app.use("/uploads/profile",express.static("uploads/profiles"))
                                
  app.use(cookieParser())
  app.use(express.json());
  app.use("/api/auth",authRoutes)
  app.use("/api/contacts",contactsRoutes)

