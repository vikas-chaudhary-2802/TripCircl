'use strict';

const mongoose = require('mongoose');

const waitlistEmailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    feature: {
      type: String,
      required: [true, 'Feature is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate signups for the same feature
waitlistEmailSchema.index({ email: 1, feature: 1 }, { unique: true });

module.exports = mongoose.model('WaitlistEmail', waitlistEmailSchema);
