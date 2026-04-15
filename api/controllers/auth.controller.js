import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { validatePassword } from "../middleware/validation.js";

export const register = async (req, res) => {
  const { username, email, password, userType } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
      missingFields: {
        username: !username,
        email: !email,
        password: !password
      }
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address"
    });
  }

  // Password strength validation
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long"
    });
  }

  try {
    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
        conflict: {
          username: existingUser.username === username,
          email: existingUser.email === email
        }
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        userType: userType || "buyer",
      },
      select: {
        id: true,
        username: true,
        email: true,
        userType: true,
        isAdmin: true,
        avatar: true,
        phoneNumber: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d'
    });

    // Set cookie with token
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    // Send success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser
    });

  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create user: " + err.message,
      error: err.message
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // CHECK IF THE USER EXISTS
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    // CHECK IF THE PASSWORD IS CORRECT
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" });

    // GENERATE COOKIE TOKEN AND SEND TO THE USER
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d'
    });

    const { password: _, ...userInfo } = user;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/'
  }).status(200).json({ message: "Logout Successful" });
};

import nodemailer from "nodemailer";
import crypto from "crypto";

const FORGOT_PASSWORD_RESPONSE = {
  message: "If an account with that email exists, a password reset link has been sent.",
};

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    if (process.env.NODE_ENV === "production" && !clientUrl.startsWith("https://")) {
      console.error("Invalid CLIENT_URL configuration for password reset");
      return res.status(500).json({ message: "Password reset is not configured" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(200).json(FORGOT_PASSWORD_RESPONSE);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = hashResetToken(resetToken);
    const resetTokenExpr = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: hashedResetToken,
        resetTokenExpr,
      },
    });

    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("DEV MODE: Reset Link:", resetUrl);
      return res.status(200).json(FORGOT_PASSWORD_RESPONSE);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.</p>
             <p>Click authentication link below to reset password:</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json(FORGOT_PASSWORD_RESPONSE);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        message: "Password must be 8-128 characters with at least one letter and one number",
      });
    }

    const hashedResetToken = hashResetToken(token);
    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedResetToken,
        resetTokenExpr: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpr: null,
      },
    });

    res.status(200).json({ message: "Password reset successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const verifySession = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true, username: true, email: true, avatar: true,
        userType: true, isAdmin: true, accountStatus: true,
      },
    });
    if (!user || user.accountStatus === "suspended") {
      return res.status(401).json({ message: "User not found or suspended" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid session" });
  }
};
