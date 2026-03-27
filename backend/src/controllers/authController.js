'use strict';

const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const authController = {
  /**
   * POST /api/auth/register
   */
  register: asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const user = await authService.register({ name, email, password });
    return res.success({ user }, 'Account created successfully', 201);
  }),

  /**
   * POST /api/auth/login
   */
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = req.ip || req.connection?.remoteAddress || null;

    const result = await authService.login({ email, password, deviceInfo, ipAddress });
    return res.success(result, 'Login successful');
  }),

  /**
   * POST /api/auth/refresh
   */
  refresh: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshTokens({ rawRefreshToken: refreshToken });
    return res.success(tokens, 'Tokens refreshed');
  }),

  /**
   * POST /api/auth/logout
   */
  logout: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await authService.logout({ rawRefreshToken: refreshToken });
    }
    return res.success(null, 'Logged out successfully');
  }),

  /**
   * POST /api/auth/logout-all   (protected)
   */
  logoutAll: asyncHandler(async (req, res) => {
    await authService.logoutAll({ userId: req.user._id });
    return res.success(null, 'Logged out from all devices');
  }),

  /**
   * GET /api/auth/me   (protected)
   */
  getMe: asyncHandler(async (req, res) => {
    return res.success({ user: req.user }, 'User retrieved');
  }),

  /**
   * GET /api/auth/sessions   (protected)
   */
  getSessions: asyncHandler(async (req, res) => {
    const sessions = await authService.getSessions({ userId: req.user._id });
    return res.success({ sessions }, 'Active sessions retrieved');
  }),
};

module.exports = authController;
