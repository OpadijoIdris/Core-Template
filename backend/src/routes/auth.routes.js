import { Router } from "express";
import { register, login, verifyEmail, logout, resendVerificationEmail, forgotPassword, resetPassword, changePassword, me } from "../controller/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", protect, changePassword);
router.post("/logout", protect, logout);
router.get("/me", protect, me);

export default router;
