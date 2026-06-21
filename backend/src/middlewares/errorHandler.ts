import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

/**
 * Global Express centralized error-handling middleware.
 * Prevents system/stack leaks in production environments and provides formatted responses.
 */
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Always log errors internally for monitoring and debugging
  console.error('[Error Handler Log]:', error);

  const isProduction = process.env.NODE_ENV === 'production';

  // Handle Zod Schema Validation Errors
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Input Validation Failed',
      errors: error.errors.map((err) => ({
        field: err.path.slice(1).join('.'), // Remove 'body' prefix from Zod path
        message: err.message,
      })),
    });
    return;
  }

  // Handle Mongoose Validation Errors
  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      success: false,
      message: 'Database Validation Failed',
      errors: Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      })),
    });
    return;
  }

  // Handle Mongoose Invalid ID Casting Errors
  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: `Invalid identifier value: '${error.value}' for field '${error.path}'`,
    });
    return;
  }

  // Handle MongoDB Unique Constraint / Duplicate Key Error
  if (error.code === 11000) {
    const duplicatedField = Object.keys(error.keyValue || {})[0] || 'field';
    res.status(409).json({
      success: false,
      message: `Conflict: A record with this '${duplicatedField}' already exists.`,
    });
    return;
  }

  // Default Standard Server Error
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: error.stack }),
  });
};
