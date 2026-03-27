'use strict';

/**
 * Operational (expected) errors that can be safely sent to the client.
 * Stack traces are preserved for logging, but message is client-safe.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors; // validation error details
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
