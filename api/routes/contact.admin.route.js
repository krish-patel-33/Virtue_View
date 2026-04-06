import express from "express";
import { requireAdmin, verifyToken } from "../middleware/verifyToken.js";
import {
  getContactMessages,
  markMessageAsRead,
  resolveMessage,
  deleteContactMessage,
} from "../controllers/contact.admin.controller.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);
router.use(requireAdmin);

// Contact message routes
router.get("/", getContactMessages);
router.put("/:id/read", markMessageAsRead);
router.put("/:id/resolve", resolveMessage);
router.delete("/:id", deleteContactMessage);

export default router;
