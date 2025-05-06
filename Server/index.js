import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./Routes/Authroute.js";
import contactsRoutes from "./Routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./Routes/MessagesRoutes.js";
import channelRoutes from "./Routes/ChannelRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9999;
const databaseURL = process.env.DATABASE_URL;

mongoose
  .connect(databaseURL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));
  // app.use("/uploads/file", express.static("uploads/files"))


app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes); // ✅ Fixed here

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

setupSocket(server);
