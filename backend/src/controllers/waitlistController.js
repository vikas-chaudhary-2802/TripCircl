'use strict';

const { addToWaitlist } = require('../services/waitlistService');
const asyncHandler = require('../utils/asyncHandler');

const waitlistController = {
  /**
   * POST /api/waitlist
   */
  signup: asyncHandler(async (req, res) => {
    const { email, feature } = req.body;

    if (!email || !feature) {
      return res.error('Email and feature are required', null, 400);
    }

    const result = await addToWaitlist(email, feature);
    return res.success(result, result.message, 200);
  }),
};

module.exports = waitlistController;
