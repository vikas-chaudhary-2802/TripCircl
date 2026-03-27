'use strict';

/**
 * Attaches helper methods to res so controllers never construct raw JSON.
 * All responses follow the envelope: { success, message, data, error? }
 */
const apiResponse = (req, res, next) => {
  /**
   * 2xx success response
   * @param {*} data
   * @param {string} message
   * @param {number} statusCode
   */
  res.success = (data = null, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({ success: true, message, data });
  };

  /**
   * Paginated list response
   */
  res.paginated = (data, pagination, message = 'Success') => {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination, // { page, limit, total, totalPages }
    });
  };

  /**
   * Error response — only use for known non-thrown errors.
   * Thrown errors go through the centralized error handler.
   */
  res.error = (message = 'Something went wrong', error = null, statusCode = 400) => {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error || message,
    });
  };

  next();
};

module.exports = apiResponse;
