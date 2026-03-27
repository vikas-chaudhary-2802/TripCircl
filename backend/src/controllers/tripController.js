'use strict';

const tripService = require('../services/tripService');
const asyncHandler = require('../utils/asyncHandler');

const tripController = {
  /**
   * POST /api/trips
   */
  create: asyncHandler(async (req, res) => {
    const trip = await tripService.createTrip(req.body, req.user._id);
    return res.success({ trip }, 'Trip created successfully', 201);
  }),

  /**
   * GET /api/trips
   */
  getAll: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, category, destination } = req.query;
    const query = {};
    if (category) query.category = category;
    if (destination) query.destination = new RegExp(destination, 'i');

    const options = {
      skip: (page - 1) * limit,
      limit: parseInt(limit, 10),
    };

    const trips = await tripService.getAllTrips(query, options);
    return res.success({ trips }, 'Trips retrieved successfully');
  }),

  /**
   * GET /api/trips/:id
   */
  getOne: asyncHandler(async (req, res) => {
    const trip = await tripService.getTrip(req.params.id);
    return res.success({ trip }, 'Trip retrieved successfully');
  }),

  /**
   * POST /api/trips/:id/join
   */
  join: asyncHandler(async (req, res) => {
    await tripService.joinTrip(req.params.id, req.user._id);
    return res.success(null, 'Membership request sent successfully');
  }),

  /**
   * GET /api/trips/me
   */
  getMyTrips: asyncHandler(async (req, res) => {
    const trips = await tripService.getUserTrips(req.user._id);
    return res.success({ trips }, 'Your trips retrieved successfully');
  }),

  /**
   * POST /api/trips/:id/approve/:userId
   */
  approveMember: asyncHandler(async (req, res) => {
    const { id, userId } = req.params;
    await tripService.approveMember(id, userId, req.user._id);
    return res.success(null, 'Member approved successfully');
  }),
};

module.exports = tripController;
