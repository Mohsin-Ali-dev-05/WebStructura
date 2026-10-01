import { API_BASE_URL, apiRequest, getStoredToken } from './api.js';

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

/**
 * POST /api/ai/generate-stream — consume SSE tokens from Ollama via Express.
 * @param {{ name?: string, description?: string, prompt?: string, onChunk?: (text: string) => void, signal?: AbortSignal }} options
 * @returns {Promise<string>} final concatenated model text
 */
export async function streamWebsiteGeneration({
  name,
  description,
  prompt,
  onChunk,
  signal,
} = {}) {
  const authToken = getStoredToken();
  const response = await fetch(`${API_BASE_URL}/api/ai/generate-stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({ name, description, prompt }),
    signal,
  });

  if (!response.ok) {
    let message = `AI stream failed with status ${response.status}`;
    try {
      const payload = await response.json();
      if (payload?.message) {
        message = payload.message;
      }
    } catch {
      // ignore non-JSON error bodies
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (!response.body) {
    throw new Error('AI stream response had no body.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';
  let streamError = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';

    for (const part of parts) {
      const lines = part.split('\n');
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line.startsWith('data:')) {
          continue;
        }

        const payload = line.slice(5).trim();
        if (!payload) {
          continue;
        }

        if (payload === '[DONE]') {
          if (streamError) {
            throw new Error(streamError);
          }
          return fullText;
        }

        try {
          const parsed = JSON.parse(payload);
          if (typeof parsed?.error === 'string' && parsed.error) {
            streamError = parsed.error;
            continue;
          }
          const chunk = typeof parsed?.chunk === 'string' ? parsed.chunk : '';
          if (chunk) {
            fullText += chunk;
            if (typeof onChunk === 'function') {
              onChunk(chunk);
            }
          }
        } catch {
          // ignore malformed SSE payloads
        }
      }
    }
  }

  if (streamError) {
    throw new Error(streamError);
  }

  return fullText;
}
