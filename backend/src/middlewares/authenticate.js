'use strict';

const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECRET } = require('../config/env');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

/**
 * Verifies the Bearer access token.
 * Attaches req.user (without password) for downstream use.
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required. Please provide a valid token.', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    const user = await userRepository.findById(decoded.id);
    if (!user) return next(new AppError('User no longer exists', 401));
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Access token expired. Please refresh your session.', 401));
    }
    return next(new AppError('Invalid access token', 401));
  }
};

module.exports = authenticate;
