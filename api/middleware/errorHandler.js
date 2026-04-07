import { HTTP_STATUS } from '../constants.js';

// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging (only in development)
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err);
  }

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(HTTP_STATUS.CONFLICT).json({
      message: 'A record with this information already exists',
      field: err.meta?.target,
    });
  }

  if (err.code === 'P2025') {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: 'Record not found',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: 'Token expired',
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Validation failed',
      errors: err.errors,
    });
  }

  // Default error response
  const statusCode = err.statusCode || HTTP_STATUS.SERVER_ERROR;
  const message = process.env.NODE_ENV === 'production'
    ? 'An error occurred. Please try again later.'
    : err.message || 'Internal server error';

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

// 404 handler
export const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
};

// Async handler wrapper to catch errors in async route handlers
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
