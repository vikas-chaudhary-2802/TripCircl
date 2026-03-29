'use strict';

const { NODE_ENV } = require('./env'); // ALLOWED_ORIGINS ki zarurat nahi ab

const corsOptions = {
  origin: (origin, callback) => {
    // Ab SAARI origins allow — koi bhi frontend (localhost, production, mobile, Postman, etc.)
    // credentials: true ke saath bhi perfectly kaam karega
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400, // 24 hours preflight cache
  optionsSuccessStatus: 204,
};

module.exports = corsOptions;