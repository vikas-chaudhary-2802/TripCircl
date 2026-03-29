'use strict';

const express = require('express');
const router = express.Router();
const waitlistController = require('../controllers/waitlistController');

// Public — no auth required
router.post('/', waitlistController.signup);

module.exports = router;
