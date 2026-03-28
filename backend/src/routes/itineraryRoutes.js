'use strict';

const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');
const authenticate = require('../middlewares/authenticate');

// Protected — user must be logged in
router.use(authenticate);
router.post('/generate', itineraryController.generate);

module.exports = router;
