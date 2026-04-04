import express from "express";
import { requireAdmin, verifyToken } from "../middleware/verifyToken.js";
import {
  getAdminStats,
  getAdminBookings,
  getAdminUsers,
  getAdminProperties,
  updateAdminUser,
  deleteAdminUser,
  updateAdminProperty,
  deleteAdminProperty,
  suspendUser,
  activateUser,
  approveProperty,
  rejectProperty,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Apply verifyToken middleware to all admin routes
router.use(verifyToken);
router.use(requireAdmin);

// Dashboard statistics
router.get("/stats", getAdminStats);

// Get all bookings
router.get("/bookings", getAdminBookings);

// Get all users
router.get("/users", getAdminUsers);
router.put("/users/:id", updateAdminUser);
router.delete("/users/:id", deleteAdminUser);
router.post("/users/:id/suspend", suspendUser);
router.post("/users/:id/activate", activateUser);

// Get all properties
router.get("/properties", getAdminProperties);
router.put("/properties/:id", updateAdminProperty);
router.delete("/properties/:id", deleteAdminProperty);
router.post("/properties/:id/approve", approveProperty);
router.post("/properties/:id/reject", rejectProperty);

export default router; 
