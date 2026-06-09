import { Router } from 'express';
import { calculateFootprint, getFootprintHistory } from '../controllers/footprint.controller';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { calculateFootprintSchema } from '../validations/footprint.validation';

const router = Router();

/**
 * @route   POST /api/footprint/calculate
 * @desc    Submit natural language text describing activity to calculate carbon emissions
 * @access  Private
 */
router.post('/calculate', auth, validate(calculateFootprintSchema), calculateFootprint);

/**
 * @route   GET /api/footprint/history
 * @desc    Get all footprint records for the authenticated user
 * @access  Private
 */
router.get('/history', auth, getFootprintHistory);

export default router;
