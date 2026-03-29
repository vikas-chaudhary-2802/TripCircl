'use strict';

const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { validate } = require('../validators/tripValidator');
const authenticate = require('../middlewares/authenticate');

// Public routes
router.get('/', tripController.getAll);
router.get('/:id', tripController.getOne);

// Protected routes
router.use(authenticate);
router.post('/', validate('createTrip'), tripController.create);
router.get('/me', tripController.getMyTrips);
router.get('/:id/members', tripController.getMembers);
router.post('/:id/join', tripController.join);
router.post('/:id/approve/:userId', tripController.approveMember);

module.exports = router;
