'use strict';

const AppError = require('../utils/AppError');

/**
 * RBAC middleware — call after authenticate.
 * Usage: authorize('admin', 'moderator')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError(
        `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`,
        403
      )
    );
  }
  next();
};

module.exports = authorize;
