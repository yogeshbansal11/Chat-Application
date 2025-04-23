import { Router } from "express";
import { verifyToken } from "../Middlewares/Authmiddleware.js";
import { getMessages, uploadFile } from "../Controllers/MessagesController.js";
import multer from "multer";

const messagesRoutes = Router();
const upload = multer({ dest: "uploads/files" });
messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.post(
  "/upload-file",
  verifyToken,
  upload.single("file"),
  uploadFile
);

export default messagesRoutes;
