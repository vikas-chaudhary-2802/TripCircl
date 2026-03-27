'use strict';

const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
  } catch (error) {
    logger.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
