import express from "express";
import { shouldBeAdmin, shouldBeLoggedIn } from "../controllers/test.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/should-be-logged-in", verifyToken, shouldBeLoggedIn);
router.get("/should-be-admin", verifyToken, verifyAdmin, shouldBeAdmin);

export default router;
