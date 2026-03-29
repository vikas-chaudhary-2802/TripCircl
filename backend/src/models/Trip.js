'use strict';

const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Trip title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    budget: {
      type: Number,
      required: true,
      min: [0, 'Budget cannot be negative'],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    maxMembers: {
      type: Number,
      default: 10,
    },
    currentMembersCount: {
      type: Number,
      default: 1,
    },
    category: {
      type: String,
      enum: ['Adventure', 'Luxury', 'Budget', 'Relaxation', 'Cultural', 'Backpacking'],
      default: 'Adventure',
    },
    images: [{ type: String }],
    itinerary: [
      {
        day: Number,
        activity: String,
        location: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for common queries
tripSchema.index({ destination: 'text', title: 'text' });
tripSchema.index({ organizer: 1 });
tripSchema.index({ status: 1 });
tripSchema.index({ startDate: 1 });

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
