'use strict';

const Trip = require('../models/Trip');
const TripMember = require('../models/TripMember');

const tripRepository = {
  create: (tripData) => Trip.create(tripData),

  findById: (id) => Trip.findById(id).populate('organizer', 'name email avatar rating'),

  findAll: (query = {}, options = {}) => {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    return Trip.find(query)
      .populate('organizer', 'name email avatar rating')
      .skip(skip)
      .limit(limit)
      .sort(sort);
  },

  updateById: (id, update) => Trip.findByIdAndUpdate(id, update, { new: true, runValidators: true }),

  deleteById: (id) => Trip.findByIdAndDelete(id),

  // Member-related queries
  addMember: (tripId, userId, role = 'member', status = 'pending') =>
    TripMember.create({ trip: tripId, user: userId, role, status }),

  findMember: (tripId, userId) => TripMember.findOne({ trip: tripId, user: userId }),

  findMembersByTrip: (tripId) => TripMember.find({ trip: tripId }).populate('user', 'name email avatar rating'),

  findTripsByUser: (userId, status = 'approved') =>
    TripMember.find({ user: userId, status })
      .populate({
        path: 'trip',
        populate: { path: 'organizer', select: 'name email avatar rating' },
      })
      .then((memberships) => memberships.map((m) => m.trip).filter(Boolean)),

  updateMemberStatus: (tripId, userId, status) =>
    TripMember.findOneAndUpdate({ trip: tripId, user: userId }, { status }, { new: true, runValidators: true }),

  countMembers: (tripId, status = 'approved') => TripMember.countDocuments({ trip: tripId, status }),
};

module.exports = tripRepository;
