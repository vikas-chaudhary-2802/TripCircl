'use strict';

const mongoose = require('mongoose');

const tripMemberSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'waitlist'],
      default: 'pending',
    },
    role: {
      type: String,
      enum: ['organizer', 'member'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate memberships
tripMemberSchema.index({ trip: 1, user: 1 }, { unique: true });
tripMemberSchema.index({ user: 1, status: 1 });

const TripMember = mongoose.model('TripMember', tripMemberSchema);

module.exports = TripMember;
