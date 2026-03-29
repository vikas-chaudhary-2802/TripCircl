'use strict';

const rateLimit = require('express-rate-limit');
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX, AUTH_RATE_LIMIT_MAX } = require('../config/env');

const limiterMessage = {
  success: false,
  message: 'Too many requests from this IP. Please try again later.',
  error: 'RATE_LIMIT_EXCEEDED',
};

/**
 * General API rate limiter — applies to all routes.
 */
const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: limiterMessage,
});

/**
 * Stricter limiter for auth endpoints (prevents brute-force).
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many auth attempts. Please try again after 15 minutes.',
    error: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
  skipSuccessfulRequests: true, // don't count successful logins
});

module.exports = { apiLimiter, authLimiter };
