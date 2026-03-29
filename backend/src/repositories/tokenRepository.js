'use strict';

const Token = require('../models/Token');
const { JWT_REFRESH_EXPIRES_IN } = require('../config/env');

/**
 * Convert "7d", "15m" style strings to milliseconds.
 */
const parseDuration = (str) => {
  const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  const match = str.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Invalid duration: ${str}`);
  return parseInt(match[1], 10) * units[match[2]];
};

const tokenRepository = {
  create: ({ userId, rawToken, deviceInfo, ipAddress }) => {
    const tokenHash = Token.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + parseDuration(JWT_REFRESH_EXPIRES_IN));
    return Token.create({ user: userId, tokenHash, deviceInfo, ipAddress, expiresAt });
  },

  findByHash: (rawToken) => {
    const tokenHash = Token.hashToken(rawToken);
    return Token.findOne({ tokenHash, isRevoked: false }).populate('user');
  },

  revokeByHash: (rawToken) => {
    const tokenHash = Token.hashToken(rawToken);
    return Token.findOneAndUpdate({ tokenHash }, { isRevoked: true }, { new: true });
  },

  revokeAllForUser: (userId) =>
    Token.updateMany({ user: userId, isRevoked: false }, { isRevoked: true }),

  getActiveSessionsForUser: (userId) =>
    Token.find({ user: userId, isRevoked: false, expiresAt: { $gt: new Date() } }).select(
      '-tokenHash -user'
    ),

  deleteExpiredTokens: () =>
    Token.deleteMany({ expiresAt: { $lt: new Date() } }),
};

module.exports = tokenRepository;
