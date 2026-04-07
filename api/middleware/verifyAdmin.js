import prisma from "../lib/prisma.js";
import { HTTP_STATUS, ERROR_MESSAGES, ACCOUNT_STATUS } from "../constants.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    // Assumes verifyToken middleware already ran and set req.userId
    if (!req.userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        isAdmin: true,
        accountStatus: true,
      },
    });

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'User not found',
      });
    }

    if (user.accountStatus === ACCOUNT_STATUS.SUSPENDED) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: ERROR_MESSAGES.AUTH.ACCOUNT_SUSPENDED,
      });
    }

    if (!user.isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: ERROR_MESSAGES.AUTH.ADMIN_REQUIRED,
      });
    }

    next();
  } catch (err) {
    console.error("Admin verification error:", err);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      message: 'Authorization failed',
    });
  }
};
