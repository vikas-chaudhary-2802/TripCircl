'use strict';

const jwt = require('jsonwebtoken');
const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} = require('../config/env');
const userRepository = require('../repositories/userRepository');
const tokenRepository = require('../repositories/tokenRepository');
const AppError = require('../utils/AppError');

const authService = {
  /**
   * Register a new user.
   */
  register: async ({ name, email, password }) => {
    const exists = await userRepository.existsByEmail(email);
    if (exists) throw new AppError('An account with this email already exists', 409);

    const user = await userRepository.create({ name, email, password });
    return user;
  },

  /**
   * Authenticate user, issue access + refresh tokens,
   * and persist refresh token hash in DB.
   */
  login: async ({ email, password, deviceInfo = 'Unknown Device', ipAddress = null }) => {
    const user = await userRepository.findByEmail(email, true); // include password
    if (!user) throw new AppError('Invalid email or password', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);

    await userRepository.updateLastLogin(user._id);

    const payload = { id: user._id, role: user.role };

    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    // Store hashed refresh token for revocation support
    await tokenRepository.create({
      userId: user._id,
      rawToken: refreshToken,
      deviceInfo,
      ipAddress,
    });

    // Remove password from returned user object
    const userObj = user.toJSON();
    delete userObj.password;

    return { user: userObj, accessToken, refreshToken };
  },

  /**
   * Rotate refresh token — old one is revoked, new pair issued.
   */
  refreshTokens: async ({ rawRefreshToken }) => {
    let decoded;
    try {
      decoded = jwt.verify(rawRefreshToken, JWT_REFRESH_SECRET);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const tokenDoc = await tokenRepository.findByHash(rawRefreshToken);
    if (!tokenDoc || tokenDoc.isRevoked) {
      throw new AppError('Session not found or has been revoked', 401);
    }

    // Revoke the used token (rotation — prevents token reuse attacks)
    await tokenRepository.revokeByHash(rawRefreshToken);

    const payload = { id: decoded.id, role: decoded.role };

    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
    });
    const newRefreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    await tokenRepository.create({
      userId: decoded.id,
      rawToken: newRefreshToken,
      deviceInfo: tokenDoc.deviceInfo,
      ipAddress: tokenDoc.ipAddress,
    });

    return { accessToken, refreshToken: newRefreshToken };
  },

  /**
   * Logout from a single device by revoking the provided refresh token.
   */
  logout: async ({ rawRefreshToken }) => {
    await tokenRepository.revokeByHash(rawRefreshToken);
  },

  /**
   * Logout from ALL devices by revoking every refresh token for the user.
   */
  logoutAll: async ({ userId }) => {
    await tokenRepository.revokeAllForUser(userId);
  },

  /**
   * Return active sessions for a user.
   */
  getSessions: async ({ userId }) => {
    return tokenRepository.getActiveSessionsForUser(userId);
  },
};

module.exports = authService;
