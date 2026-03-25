'use strict';

const Joi = require('joi');
const AppError = require('../utils/AppError');

const schemas = {
  createTrip: Joi.object({
    title: Joi.string().required().max(100),
    description: Joi.string().required().max(1000),
    destination: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required().greater(Joi.ref('startDate')),
    budget: Joi.number().required().min(0),
    maxMembers: Joi.number().integer().min(1),
    category: Joi.string().valid('Adventure', 'Luxury', 'Budget', 'Relaxation', 'Cultural', 'Backpacking'),
    itinerary: Joi.array().items(
      Joi.object({
        day: Joi.number().integer().min(1),
        activity: Joi.string(),
        location: Joi.string(),
      })
    ),
  }),

  updateTrip: Joi.object({
    title: Joi.string().max(100),
    description: Joi.string().max(1000),
    destination: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref('startDate')),
    budget: Joi.number().min(0),
    maxMembers: Joi.number().integer().min(1),
    category: Joi.string().valid('Adventure', 'Luxury', 'Budget', 'Relaxation', 'Cultural', 'Backpacking'),
    status: Joi.string().valid('active', 'completed', 'cancelled'),
  }),
};

const validate = (schemaName) => (req, res, next) => {
  const schema = schemas[schemaName];
  if (!schema) return next(new AppError(`No validator for: ${schemaName}`, 500));

  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const details = error.details.map((d) => d.message);
    return next(new AppError('Validation failed', 422, details));
  }
  req.body = value;
  next();
};

module.exports = { validate };
