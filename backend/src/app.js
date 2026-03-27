'use strict';

require('./config/env'); // Validate env vars first
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = require('./config/cors');
const { apiLimiter } = require('./middlewares/rateLimiter');
const apiResponse = require('./utils/apiResponse');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');
const AppError = require('./utils/AppError');

/**
 * Simple body-only mongo sanitizer (Express 5 compatible).
 * Strips keys starting with '$' or containing '.' from req.body.
 */
const sanitizeBody = (req, _res, next) => {
  const clean = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        clean(obj[key]);
      }
    }
    return obj;
  };
  if (req.body) clean(req.body);
  next();
};

const createApp = () => {
  const app = express();

  /* ─── CORS MUST be FIRST ─── */
  app.use(cors(corsOptions));

  /* ─── Security Headers (after CORS) ─── */
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  /* ─── Body Parsers ─── */
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());

  /* ─── Sanitization (Express 5 compatible — body only) ─── */
  app.use(sanitizeBody);

  /* ─── General Rate Limiter ─── */
  app.use('/api', apiLimiter);

  /* ─── Standardized Response Helpers ─── */
  app.use(apiResponse);

  /* ─── API Routes ─── */
  app.use('/api', routes);

  /* ─── 404 Handler ─── */
  app.use((req, _res, next) => {
    next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
  });

  /* ─── Global Error Handler (MUST be last) ─── */
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
