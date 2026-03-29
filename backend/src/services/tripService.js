'use strict';

const tripRepository = require('../repositories/tripRepository');
const AppError = require('../utils/AppError');

const tripService = {
  createTrip: async (tripData, userId) => {
    const trip = await tripRepository.create({ ...tripData, organizer: userId });
    // Automatically add organizer as an approved member
    await tripRepository.addMember(trip._id, userId, 'organizer', 'approved');
    return trip;
  },

  getTrip: async (id) => {
    const trip = await tripRepository.findById(id);
    if (!trip) throw new AppError('Trip not found', 404);
    return trip;
  },

  getAllTrips: async (query, options) => {
    return tripRepository.findAll(query, options);
  },

  joinTrip: async (tripId, userId) => {
    const trip = await tripRepository.findById(tripId);
    if (!trip) throw new AppError('Trip not found', 404);

    const existingMember = await tripRepository.findMember(tripId, userId);
    if (existingMember) throw new AppError('You have already requested to join this trip', 400);

    const count = await tripRepository.countMembers(tripId, 'approved');
    if (count >= trip.maxMembers) throw new AppError('This trip is already full', 400);

    return tripRepository.addMember(tripId, userId);
  },

  getUserTrips: async (userId) => {
    return tripRepository.findTripsByUser(userId);
  },

  approveMember: async (tripId, targetUserId, organizerId) => {
    const trip = await tripRepository.findById(tripId);
    if (!trip) throw new AppError('Trip not found', 404);
    if (trip.organizer._id.toString() !== organizerId.toString()) {
      throw new AppError('Only the organizer can approve members', 403);
    }

    const member = await tripRepository.findMember(tripId, targetUserId);
    if (!member) throw new AppError('Membership request not found', 404);

    const updated = await tripRepository.updateMemberStatus(tripId, targetUserId, 'approved');

    // Update current member count in Trip model
    const count = await tripRepository.countMembers(tripId, 'approved');
    await tripRepository.updateById(tripId, { currentMembersCount: count });

    return updated;
  },

  /**
   * Get all members of a trip.
   */
  getTripMembers: async (tripId) => {
    const trip = await tripRepository.findById(tripId);
    if (!trip) throw new AppError('Trip not found', 404);
    return tripRepository.findMembersByTrip(tripId);
  },
};

module.exports = tripService;
