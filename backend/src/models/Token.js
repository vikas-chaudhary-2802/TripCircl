'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');

const tokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Store only the SHA-256 hash of the raw token for security
    tokenHash: {
      type: String,
      required: true,
    },
    deviceInfo: {
      type: String,
      default: 'Unknown Device',
      maxlength: 256,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// TTL index — MongoDB auto-deletes expired documents
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Fast lookup of valid sessions per user
tokenSchema.index({ user: 1, isRevoked: 1 });
tokenSchema.index({ tokenHash: 1 }, { unique: true });

// Helper: hash a raw refresh token
tokenSchema.statics.hashToken = (rawToken) =>
  crypto.createHash('sha256').update(rawToken).digest('hex');

module.exports = mongoose.model('Token', tokenSchema);
