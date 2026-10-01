import { asyncHandler } from '../utils/asyncHandler.js';
import {
  generateSectionCopy,
  generateText,
  streamWebsiteGeneration,
} from '../services/aiService.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

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

/**
 * POST /api/ai/generate-stream — SSE stream of full website JSON from Ollama.
 * Body: { name?, description?, prompt? }
 */
export async function generateWebsiteStream(req, res) {
  const name =
    typeof req.body?.name === 'string' && req.body.name.trim()
      ? req.body.name.trim()
      : 'My Website';
  const description =
    typeof req.body?.description === 'string'
      ? req.body.description.trim()
      : typeof req.body?.prompt === 'string'
        ? req.body.prompt.trim()
        : '';
  const prompt =
    typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  if (typeof res.flushHeaders === 'function') {
    res.flushHeaders();
  }

  const abortController = new AbortController();
  req.on('close', () => {
    abortController.abort();
  });

  try {
    await streamWebsiteGeneration(
      { name, description, prompt },
      {
        signal: abortController.signal,
        onChunk(chunk) {
          if (res.writableEnded) {
            return;
          }
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        },
      },
    );

    if (!res.writableEnded) {
      res.write('data: [DONE]\n\n');
      res.end();
    }
  } catch (error) {
    if (res.writableEnded) {
      return;
    }

    const message =
      error instanceof AppError
        ? error.message
        : error?.message || 'AI stream failed.';
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
}
