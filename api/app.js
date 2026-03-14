import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import bookingRoute from "./routes/booking.route.js";
import propertyBookingsRoute from "./routes/propertyBookings.route.js";
import contactRoute from "./routes/contact.route.js";
import convertRoute from "./routes/convert.route.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400
}));

app.use(express.json());
app.use(cookieParser());

// Serve generated 3D model files
app.use("/models", express.static(path.join(__dirname, "public/models")));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/property-bookings", propertyBookingsRoute);
app.use("/api/contact", contactRoute);
app.use("/api/convert", convertRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
