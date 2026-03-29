'use strict';

/**
 * Wraps async route handlers to eliminate try/catch boilerplate.
 * Errors are forwarded to the Express error handler.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
