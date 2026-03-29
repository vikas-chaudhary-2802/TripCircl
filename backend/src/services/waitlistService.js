'use strict';

const WaitlistEmail = require('../models/WaitlistEmail');

const featureNames = {
  '/explore': 'Discover Trips',
  '/create-trip': 'Create a Trip',
  '/dashboard': 'My Trips',
  '/messages': 'Messages',
  '/profile': 'Profile',
};

/**
 * Add an email to the waitlist for a given feature.
 * Handles duplicates gracefully.
 */
async function addToWaitlist(email, feature) {
  const featureName = featureNames[feature] || 'this feature';

  try {
    await WaitlistEmail.create({ email, feature });
  } catch (err) {
    // Duplicate key error (code 11000) — user already signed up for this feature
    if (err.code === 11000) {
      return {
        success: true,
        message: `You're already on the waitlist for ${featureName}!`,
      };
    }
    throw err;
  }

  console.log(`✅ Waitlist signup: ${email} for ${featureName}`);

  return {
    success: true,
    message: `You've been added to the waitlist for ${featureName}!`,
  };
}

module.exports = { addToWaitlist };
