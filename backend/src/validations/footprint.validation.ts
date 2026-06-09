import { z } from 'zod';

/**
 * Zod validation schema for analyzing footprint via natural language text prompt.
 */
export const calculateFootprintSchema = z.object({
  body: z.object({
    text: z
      .string({
        required_error: 'Natural language text input is required.',
      })
      .trim()
      .min(3, 'Input text must be at least 3 characters long.'),
  }),
});

/**
 * Zod validation schema for direct footprint entry using numeric metrics.
 * Enforces positive numbers for carbon input metrics.
 */
export const directFootprintSchema = z.object({
  body: z.object({
    energyEmission: z
      .number({
        required_error: 'Energy emission metric is required.',
      })
      .nonnegative('Energy emission must be zero or a positive number.'),
    transportEmission: z
      .number({
        required_error: 'Transport emission metric is required.',
      })
      .nonnegative('Transport emission must be zero or a positive number.'),
    foodEmission: z
      .number({
        required_error: 'Food emission metric is required.',
      })
      .nonnegative('Food emission must be zero or a positive number.'),
  }),
});
