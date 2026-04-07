// Application Constants
// Centralized configuration values to avoid magic numbers

// Authentication
export const AUTH = {
  JWT_EXPIRY: '7d',
  JWT_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  TOKEN_COOKIE_NAME: 'access_token',
};

// Rate Limiting
export const RATE_LIMIT = {
  LOGIN_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  LOGIN_MAX_ATTEMPTS: 5,
  API_WINDOW_MS: 60 * 1000, // 1 minute
  API_MAX_REQUESTS: 100,
  REGISTER_WINDOW_MS: 60 * 60 * 1000, // 1 hour
  REGISTER_MAX_ATTEMPTS: 3,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  POSTS_PER_PAGE: 12,
  USERS_PER_PAGE: 20,
  CHATS_PER_PAGE: 30,
};

// File Upload
export const UPLOAD = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  MAX_PROPERTY_IMAGES: 20,
};

// Validation
export const VALIDATION = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 30,
  EMAIL_MAX: 255,
  TITLE_MAX: 200,
  DESCRIPTION_MAX: 5000,
  ADDRESS_MAX: 500,
  PHONE_REGEX: /^[6-9]\d{9}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Database
export const DATABASE = {
  QUERY_TIMEOUT: 30000, // 30 seconds
  CONNECTION_LIMIT: 10,
};

// Business Logic
export const BOOKING = {
  MAX_ADVANCE_DAYS: 365, // Can book up to 1 year in advance
  MIN_BOOKING_HOURS: 24, // Must book at least 24 hours in advance
  STATUSES: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
  },
};

export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
};

export const USER_TYPES = {
  BUYER: 'buyer',
  SELLER: 'seller',
};

export const PROPERTY_TYPES = {
  RENT: 'rent',
  BUY: 'buy',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  AUTH: {
    NOT_AUTHENTICATED: 'Not authenticated',
    INVALID_CREDENTIALS: 'Invalid credentials',
    TOKEN_EXPIRED: 'Token expired',
    INVALID_TOKEN: 'Invalid token',
    ADMIN_REQUIRED: 'Admin access required',
    ACCOUNT_SUSPENDED: 'Account suspended',
  },
  VALIDATION: {
    REQUIRED_FIELDS: 'All required fields must be provided',
    INVALID_EMAIL: 'Invalid email format',
    INVALID_PASSWORD: 'Password must be at least 8 characters',
    INVALID_INPUT: 'Invalid input provided',
  },
  RESOURCE: {
    NOT_FOUND: 'Resource not found',
    ALREADY_EXISTS: 'Resource already exists',
    CREATION_FAILED: 'Failed to create resource',
    UPDATE_FAILED: 'Failed to update resource',
    DELETE_FAILED: 'Failed to delete resource',
  },
  RATE_LIMIT: {
    TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',
  },
};

export default {
  AUTH,
  RATE_LIMIT,
  PAGINATION,
  UPLOAD,
  VALIDATION,
  DATABASE,
  BOOKING,
  ACCOUNT_STATUS,
  USER_TYPES,
  PROPERTY_TYPES,
  HTTP_STATUS,
  ERROR_MESSAGES,
};
