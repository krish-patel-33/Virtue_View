import { VALIDATION, HTTP_STATUS, ERROR_MESSAGES, UPLOAD } from '../constants.js';

// Email validation
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  if (email.length > VALIDATION.EMAIL_MAX) return false;
  return VALIDATION.EMAIL_REGEX.test(email);
};

// Password validation
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8) return false;
  if (password.length > 128) return false;
  
  // Check for at least one number, one letter
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasLetter && hasNumber;
};

// Username validation
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') return false;
  if (username.length < VALIDATION.USERNAME_MIN) return false;
  if (username.length > VALIDATION.USERNAME_MAX) return false;
  
  // Alphanumeric and underscores only
  return /^[a-zA-Z0-9_]+$/.test(username);
};

// Generic string length validation
export const validateStringLength = (str, min, max) => {
  if (typeof str !== 'string') return false;
  return str.length >= min && str.length <= max;
};

// Sanitize input to prevent XSS
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  // Remove HTML tags and trim
  return str.replace(/<[^>]*>/g, '').trim();
};

// Validation middleware for registration
export const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  
  const errors = [];
  
  if (!username || !email || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS,
      errors: {
        username: !username,
        email: !email,
        password: !password,
      },
    });
  }
  
  if (!validateUsername(username)) {
    errors.push({
      field: 'username',
      message: `Username must be 3-30 characters, alphanumeric and underscores only`,
    });
  }
  
  if (!validateEmail(email)) {
    errors.push({
      field: 'email',
      message: ERROR_MESSAGES.VALIDATION.INVALID_EMAIL,
    });
  }
  
  if (!validatePassword(password)) {
    errors.push({
      field: 'password',
      message: 'Password must be 8-128 characters with at least one letter and one number',
    });
  }
  
  if (errors.length > 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Validation failed',
      errors,
    });
  }
  
  next();
};

// Validation middleware for login
export const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS,
    });
  }
  
  next();
};

// Validation middleware for post creation
export const validatePost = (req, res, next) => {
  const { title, price, address, city, bedroom, bathroom, type, property } = req.body;
  
  const errors = [];
  
  if (!title || !price || !address || !city || !type || !property) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'All required fields must be provided',
      required: ['title', 'price', 'address', 'city', 'bedroom', 'bathroom', 'type', 'property'],
    });
  }
  
  if (!validateStringLength(title, 1, VALIDATION.TITLE_MAX)) {
    errors.push({
      field: 'title',
      message: `Title must be 1-${VALIDATION.TITLE_MAX} characters`,
    });
  }
  
  if (typeof price !== 'number' || price <= 0) {
    errors.push({
      field: 'price',
      message: 'Price must be a positive number',
    });
  }
  
  if (!validateStringLength(address, 1, VALIDATION.ADDRESS_MAX)) {
    errors.push({
      field: 'address',
      message: `Address must be 1-${VALIDATION.ADDRESS_MAX} characters`,
    });
  }
  
  if (bedroom !== undefined && (typeof bedroom !== 'number' || bedroom < 0)) {
    errors.push({
      field: 'bedroom',
      message: 'Bedroom count must be a non-negative number',
    });
  }
  
  if (bathroom !== undefined && (typeof bathroom !== 'number' || bathroom < 0)) {
    errors.push({
      field: 'bathroom',
      message: 'Bathroom count must be a non-negative number',
    });
  }
  
  if (errors.length > 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Validation failed',
      errors,
    });
  }
  
  next();
};

// Validation middleware for contact form
export const validateContact = (req, res, next) => {
  const { name, email, subject, message } = req.body;
  
  const errors = [];
  
  if (!name || !email || !subject || !message) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS,
    });
  }
  
  if (!validateStringLength(name, 1, 100)) {
    errors.push({ field: 'name', message: 'Name must be 1-100 characters' });
  }
  
  if (!validateEmail(email)) {
    errors.push({ field: 'email', message: ERROR_MESSAGES.VALIDATION.INVALID_EMAIL });
  }
  
  if (!validateStringLength(subject, 1, 200)) {
    errors.push({ field: 'subject', message: 'Subject must be 1-200 characters' });
  }
  
  if (!validateStringLength(message, 1, VALIDATION.DESCRIPTION_MAX)) {
    errors.push({ field: 'message', message: `Message must be 1-${VALIDATION.DESCRIPTION_MAX} characters` });
  }
  
  if (errors.length > 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Validation failed',
      errors,
    });
  }
  
  next();
};

// File upload validation
export const validateImageUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return next();
  }
  
  const files = req.files || [req.file];
  const errors = [];
  
  files.forEach((file, index) => {
    // Check file size
    if (file.size > UPLOAD.MAX_IMAGE_SIZE) {
      errors.push({
        file: file.originalname,
        message: `File size exceeds ${UPLOAD.MAX_IMAGE_SIZE / 1024 / 1024}MB limit`,
      });
    }
    
    // Check file type
    if (!UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      errors.push({
        file: file.originalname,
        message: `Invalid file type. Allowed types: ${UPLOAD.ALLOWED_IMAGE_TYPES.join(', ')}`,
      });
    }
  });
  
  if (errors.length > 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'File validation failed',
      errors,
    });
  }
  
  next();
};

// Generic request body sanitization
export const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};
