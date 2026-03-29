'use strict';

const User = require('../models/User');

const userRepository = {
  /**
   * Find a user by email. Optionally include password field.
   */
  findByEmail: (email, includePassword = false) => {
    const query = User.findOne({ email: email.toLowerCase().trim() });
    return includePassword ? query.select('+password') : query;
  },

  findById: (id) => User.findById(id),

  create: (userData) => User.create(userData),

  updateById: (id, update) =>
    User.findByIdAndUpdate(id, update, { new: true, runValidators: true }),

  updateLastLogin: (id) =>
    User.findByIdAndUpdate(
      id,
      { lastLogin: new Date(), $inc: { loginCount: 1 } },
      { new: true }
    ),

  existsByEmail: async (email) => {
    const count = await User.countDocuments({ email: email.toLowerCase().trim() });
    return count > 0;
  },
};

module.exports = userRepository;
