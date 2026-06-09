import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

/**
 * Generic Express middleware to validate request data against a Zod schema.
 * Parses req.body, req.query, and req.params and forwards any Zod errors to the global error handler.
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // Replace req with parsed values to ensure type-safe validated data is used downstream
      req.body = parsed.body;
      req.query = parsed.query;
      req.params = parsed.params;
      next();
    } catch (error) {
      next(error);
    }
  };
};
