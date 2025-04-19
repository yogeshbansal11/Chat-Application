import { Router } from "express";
import {
  login,
  signup,
  getUserInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage,
  logout
} from "../Controllers/Authcontroller.js";
import { verifyToken } from "../Middlewares/Authmiddleware.js";
import multer from "multer";

const authRoutes = Router();

const upload = multer({ dest: "uploads/profiles/" });

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo); // ✅ correct order
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  addProfileImage
);
authRoutes.delete("/remove-profile-image",verifyToken,removeProfileImage)
authRoutes.post("/logout",logout)

export default authRoutes;
