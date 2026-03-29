'use strict';

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate } = require('../validators/authValidator');
const authenticate = require('../middlewares/authenticate');
const { authLimiter } = require('../middlewares/rateLimiter');

// Apply strict rate limit to all auth routes
router.use(authLimiter);

// Public routes
router.post('/register', validate('register'), authController.register);
router.post('/login', validate('login'), authController.login);
router.post('/refresh', validate('refresh'), authController.refresh);
router.post('/logout', validate('logout'), authController.logout);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.patch('/me', authenticate, authController.updateMe);
router.post('/logout-all', authenticate, authController.logoutAll);
router.get('/sessions', authenticate, authController.getSessions);

module.exports = router;
