import rateLimit from 'express-rate-limit';
import { RATE_LIMIT, HTTP_STATUS, ERROR_MESSAGES } from '../constants.js';

// Rate limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: RATE_LIMIT.LOGIN_WINDOW_MS,
  max: RATE_LIMIT.LOGIN_MAX_ATTEMPTS,
  message: {
    message: ERROR_MESSAGES.RATE_LIMIT.TOO_MANY_REQUESTS,
    detail: `Too many login attempts. Please try again in 15 minutes.`,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      message: 'Too many login attempts',
      detail: 'Please try again in 15 minutes',
      retryAfter: Math.ceil(RATE_LIMIT.LOGIN_WINDOW_MS / 1000 / 60),
    });
  },
});

// Rate limiter for registration
export const registerLimiter = rateLimit({
  windowMs: RATE_LIMIT.REGISTER_WINDOW_MS,
  max: RATE_LIMIT.REGISTER_MAX_ATTEMPTS,
  message: {
    message: ERROR_MESSAGES.RATE_LIMIT.TOO_MANY_REQUESTS,
    detail: `Too many registration attempts. Please try again in 1 hour.`,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      message: 'Too many registration attempts',
      detail: 'Please try again in 1 hour',
      retryAfter: Math.ceil(RATE_LIMIT.REGISTER_WINDOW_MS / 1000 / 60),
    });
  },
});

// Rate limiter for forgot password requests
export const forgotPasswordLimiter = rateLimit({
  windowMs: RATE_LIMIT.FORGOT_PASSWORD_WINDOW_MS,
  max: RATE_LIMIT.FORGOT_PASSWORD_MAX_ATTEMPTS,
  message: {
    message: ERROR_MESSAGES.RATE_LIMIT.TOO_MANY_REQUESTS,
    detail: "Too many password reset requests. Please try again in 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      message: "Too many password reset requests",
      detail: "Please try again in 1 hour",
      retryAfter: Math.ceil(RATE_LIMIT.FORGOT_PASSWORD_WINDOW_MS / 1000 / 60),
    });
  },
});

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT.API_WINDOW_MS,
  max: RATE_LIMIT.API_MAX_REQUESTS,
  message: {
    message: ERROR_MESSAGES.RATE_LIMIT.TOO_MANY_REQUESTS,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for specific routes if needed
    return req.path === '/health' || req.path === '/ping';
  },
});

// Strict rate limiter for sensitive operations
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    message: 'Too many requests for this operation',
    detail: 'Please try again in 1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
