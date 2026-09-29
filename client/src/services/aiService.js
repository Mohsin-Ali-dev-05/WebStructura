import { apiRequest } from './api.js';

/**
 * POST /api/ai/generate — proxied to Express → Ollama.
 * Never call Ollama from the browser.
 */
export function generateSection({ prompt, sectionType }) {
  return apiRequest('/api/ai/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt, sectionType }),
  });
}
