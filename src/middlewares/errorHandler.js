// src/middlewares/errorHandler.js
const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Middleware untuk menangani error secara terpusat
 * Mengubah berbagai jenis error menjadi respons API yang konsisten
 */
exports.errorHandler = (err, req, res, next) => {
  // Set default status dan pesan
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = [];
  let errorCode = err.code || 'INTERNAL_ERROR';
  
  // Log error
  logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${message}`, {
    error: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
    tenant: req.tenant ? req.tenant.domain : 'unknown'
  });
  
  // Handle berbagai jenis error

  // Sequelize validation errors
  if (err instanceof Sequelize.ValidationError) {
    statusCode = 400;
    message = 'Validation Error';
    errorCode = 'VALIDATION_ERROR';
    errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
      value: e.value
    }));
  }
  
  // Sequelize unique constraint error
  else if (err instanceof Sequelize.UniqueConstraintError) {
    statusCode = 409; // Conflict
    message = 'Duplicate Entry';
    errorCode = 'DUPLICATE_ENTRY';
    errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
      value: e.value
    }));
  }
  
  // Sequelize foreign key constraint error
  else if (err instanceof Sequelize.ForeignKeyConstraintError) {
    statusCode = 409;
    message = 'Foreign Key Constraint Error';
    errorCode = 'FOREIGN_KEY_ERROR';
  }
  
  // Sequelize database error
  else if (err instanceof Sequelize.DatabaseError) {
    statusCode = 500;
    message = 'Database Error';
    errorCode = 'DATABASE_ERROR';
    // Jangan tampilkan detail SQL di response produksi
    if (process.env.NODE_ENV === 'production') {
      message = 'Database operation failed';
    }
  }
  
  // Handle schema errors
  else if (err.name === 'SchemaError') {
    statusCode = 400;
    message = err.message;
    errorCode = 'SCHEMA_ERROR';
  }
  
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token';
    errorCode = 'INVALID_TOKEN';
  }
  
  // Handle NotFound errors
  else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = err.message || 'Resource not found';
    errorCode = 'RESOURCE_NOT_FOUND';
  }
  
  // Handle bussiness logic errors
  else if (err.name === 'BusinessLogicError') {
    statusCode = 422;
    message = err.message;
    errorCode = err.code || 'BUSINESS_LOGIC_ERROR';
  }
  
  // Handle permission errors
  else if (err.name === 'PermissionError') {
    statusCode = 403;
    message = err.message || 'Permission denied';
    errorCode = 'PERMISSION_DENIED';
  }
  
  // Handle uncaught errors
  else if (statusCode === 500) {
    // Tampilkan generic message di production
    if (process.env.NODE_ENV === 'production') {
      message = 'Internal Server Error';
    }
  }
  
  // Format respons API
  const errorResponse = {
    status: 'error',
    statusCode,
    message,
    errorCode,
    ...(errors.length > 0 && { errors })
  };
  
  // Tambahkan stack trace untuk development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  // Tambahkan request ID jika ada (berguna untuk tracking)
  if (req.id) {
    errorResponse.requestId = req.id;
  }
  
  // Kirim respons
  return res.status(statusCode).json(errorResponse);
};

/**
 * Middleware untuk menangkap error dari async/await routes
 * @param {Function} fn - Async route handler
 */
exports.asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Custom error kelas untuk digunakan dalam aplikasi
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

exports.AppError = AppError;

// Custom error classes

/**
 * Error untuk operasi yang tidak ditemukan resource
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'RESOURCE_NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/**
 * Error untuk masalah validasi
 */
class ValidationError extends AppError {
  constructor(message = 'Validation error', errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Error untuk masalah pada schema database
 */
class SchemaError extends AppError {
  constructor(message = 'Schema error') {
    super(message, 400, 'SCHEMA_ERROR');
    this.name = 'SchemaError';
  }
}

/**
 * Error untuk masalah autentikasi
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

/**
 * Error untuk masalah otorisasi/izin
 */
class PermissionError extends AppError {
  constructor(message = 'Permission denied') {
    super(message, 403, 'PERMISSION_DENIED');
    this.name = 'PermissionError';
  }
}

/**
 * Error untuk logika bisnis
 */
class BusinessLogicError extends AppError {
  constructor(message, code = 'BUSINESS_LOGIC_ERROR') {
    super(message, 422, code);
    this.name = 'BusinessLogicError';
  }
}

// Export custom error classes
exports.NotFoundError = NotFoundError;
exports.ValidationError = ValidationError;
exports.SchemaError = SchemaError;
exports.AuthenticationError = AuthenticationError;
exports.PermissionError = PermissionError;
exports.BusinessLogicError = BusinessLogicError;