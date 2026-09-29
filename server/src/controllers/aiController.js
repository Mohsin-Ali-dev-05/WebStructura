import { asyncHandler } from '../utils/asyncHandler.js';
import {
  generateSectionCopy,
  generateText,
} from '../services/aiService.js';
import { env } from '../config/env.js';

/**
 * POST /api/ai/test — smoke-test the local Ollama connection.
 * Does not generate website JSON; returns plain model text only.
 */
export const testAi = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  const result = await generateText(prompt);

  res.status(200).json({
    success: true,
    message: 'Local AI service responded successfully.',
    data: {
      model: result.model,
      configuredModel: env.ollamaModel,
      prompt,
      response: result.text,
      done: result.done,
    },
  });
});

/**
 * POST /api/ai/generate — production copy for a builder section.
 * Returns plain text only; never executes model output.
 */
export const generateAi = asyncHandler(async (req, res) => {
  const { prompt, sectionType } = req.body;
  const result = await generateSectionCopy(prompt, sectionType);

  res.status(200).json({
    success: true,
    text: result.text,
  });
});
