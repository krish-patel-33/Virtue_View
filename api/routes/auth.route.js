import express from "express";
import { login, logout, register, forgotPassword, resetPassword, verifySession } from "../controllers/auth.controller.js";
import { forgotPasswordLimiter, loginLimiter, registerLimiter } from "../middleware/rateLimiter.js";
import { validateRegistration, validateLogin, sanitizeBody } from "../middleware/validation.js";

const router = express.Router();

router.post("/register", sanitizeBody, validateRegistration, registerLimiter, register);
router.post("/login", sanitizeBody, validateLogin, loginLimiter, login);
router.post("/logout", logout);
router.post("/forgot-password", sanitizeBody, forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify", verifySession);

export default router;
