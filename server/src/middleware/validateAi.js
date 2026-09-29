import { AppError } from '../utils/AppError.js';
import { AI_SECTION_TYPES } from '../services/aiService.js';
import { requireBody } from '../utils/validateRequest.js';

/**
 * Validates POST /api/ai/test body: { prompt: string }
 */
export function validateAiTest(req, res, next) {
  try {
    requireBody(req);
    const { prompt } = req.body;

    if (typeof prompt !== 'string' || !prompt.trim()) {
      return next(
        new AppError(
          'A non-empty "prompt" string is required in the request body.',
          400,
        ),
      );
    }

    if (prompt.trim().length > 4000) {
      return next(new AppError('Prompt must be 4000 characters or fewer.', 400));
    }

    req.body.prompt = prompt.trim();
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Validates POST /api/ai/generate body: { prompt: string, sectionType: string }
 */
export function validateAiGenerate(req, res, next) {
  try {
    requireBody(req);
    const { prompt, sectionType } = req.body;
    const errors = [];

    if (typeof prompt !== 'string' || !prompt.trim()) {
      errors.push('A non-empty "prompt" string is required.');
    } else if (prompt.trim().length > 2000) {
      errors.push('Prompt must be 2000 characters or fewer.');
    }

    if (typeof sectionType !== 'string' || !sectionType.trim()) {
      errors.push('A non-empty "sectionType" string is required (e.g. "Hero").');
    } else if (!AI_SECTION_TYPES.includes(sectionType.trim())) {
      errors.push(
        `Invalid sectionType. Allowed: ${AI_SECTION_TYPES.join(', ')}.`,
      );
    }

    if (errors.length > 0) {
      return next(new AppError(errors.join(' '), 400));
    }

    req.body.prompt = prompt.trim();
    req.body.sectionType = sectionType.trim();
    next();
  } catch (error) {
    next(error);
  }
}
