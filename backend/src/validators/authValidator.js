'use strict';

const Joi = require('joi');
const AppError = require('../utils/AppError');

const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(80).required().messages({
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required',
    }),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  refresh: Joi.object({
    refreshToken: Joi.string().required().messages({
      'any.required': 'Refresh token is required',
    }),
  }),

  logout: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

/**
 * Returns an Express middleware that validates req.body against the named schema.
 */
const validate = (schemaName) => (req, res, next) => {
  const schema = schemas[schemaName];
  if (!schema) return next(new AppError(`No validator for: ${schemaName}`, 500));

  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const details = error.details.map((d) => d.message);
    return next(new AppError('Validation failed', 422, details));
  }
  req.body = value; // use sanitized/validated body
  next();
};

module.exports = { validate };
