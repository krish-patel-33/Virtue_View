import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Not Authenticated! Please login again." 
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = payload.id;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(403).json({ 
      success: false,
      message: "Token is not valid! Please login again." 
    });
  }
};

export const requireAdmin = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, isAdmin: true },
    });

    if (!user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (err) {
    console.error("Admin verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to verify admin access",
    });
  }
};
