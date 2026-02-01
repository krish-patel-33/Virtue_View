import express from "express";
import { addContactMsg } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/", addContactMsg);

export default router;
