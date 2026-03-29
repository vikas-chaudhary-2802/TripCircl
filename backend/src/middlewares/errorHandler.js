'use strict';

const logger = require('../config/logger');
const AppError = require('../utils/AppError');
const { NODE_ENV } = require('../config/env');

/**
 * Handle specific Mongoose and JWT errors and convert to AppError.
 */
const handleMongooseCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleMongooseDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} already exists. Please use a different value.`, 409);
};

const handleMongooseValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => e.message);
  return new AppError('Validation failed', 422, errors);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

/**
 * Central error handler — must be registered LAST in app.js
 */
const errorHandler = (err, req, res, _next) => {
  let error = err;

  // Convert known error types to AppError
  if (err.name === 'CastError') error = handleMongooseCastError(err);
  else if (err.code === 11000) error = handleMongooseDuplicateKeyError(err);
  else if (err.name === 'ValidationError') error = handleMongooseValidationError(err);
  else if (err.name === 'JsonWebTokenError') error = handleJWTError();
  else if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Something went wrong on our end.';

  // Log non-operational (unexpected) errors as errors, operational as warnings
  if (error.isOperational) {
    logger.warn(`${statusCode} | ${req.method} ${req.originalUrl} | ${message}`);
  } else {
    logger.error(`${statusCode} | ${req.method} ${req.originalUrl} | ${err.stack || err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: error.isOperational ? (error.errors || error.message) : message,
    ...(NODE_ENV === 'development' && !error.isOperational && { stack: err.stack }),
  });
};

module.exports = errorHandler;
