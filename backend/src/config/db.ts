import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Logs success or terminates the process with status code 1 on connection failure.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('CRITICAL ERROR: MONGODB_URI environment variable is missing.');
      process.exit(1);
    }

    // Set connection event handlers before connecting
    mongoose.connection.on('connected', () => {
      console.log('Successfully connected to MongoDB database.');
    });

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error occurred:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected from database.');
    });

    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error('Failed to establish database connection during startup:', error);
    process.exit(1);
  }
};
