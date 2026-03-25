'use strict';

const express = require('express');
const router = express.Router();

// Mount feature routers here
router.use('/auth', require('./authRoutes'));
router.use('/trips', require('./tripRoutes'));

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

module.exports = router;
