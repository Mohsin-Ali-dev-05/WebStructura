const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
export const TOKEN_STORAGE_KEY = 'awb_auth_token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export async function apiRequest(path, options = {}) {
  const { timeoutMs, signal: outerSignal, ...fetchOptions } = options;

  const isFormData =
    typeof FormData !== 'undefined' && fetchOptions.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(fetchOptions.headers || {}),
  };

  // Let the browser set multipart boundary for FormData uploads.
  if (isFormData && headers['Content-Type']) {
    delete headers['Content-Type'];
  }

  const token = getStoredToken();

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  let timeoutId;

  if (outerSignal) {
    if (outerSignal.aborted) {
      controller.abort();
    } else {
      outerSignal.addEventListener('abort', () => controller.abort(), {
        once: true,
      });
    }
  }

  if (typeof timeoutMs === 'number' && timeoutMs > 0) {
    timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        payload?.message || `Request failed with status ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.payload = payload;
      // Axios-compatible shape so UI can read err.response.data.message
      error.response = { data: payload, status: response.status };
      throw error;
    }

    return payload;
  } catch (error) {
    if (error?.name === 'AbortError') {
      // Only map to TIMEOUT when our timer fired — not intentional cancels.
      if (timeoutId != null && !outerSignal?.aborted) {
        const timeoutError = new Error(
          'Request timed out. The AI may still be working — try again in a moment.',
        );
        timeoutError.code = 'TIMEOUT';
        timeoutError.name = 'TimeoutError';
        throw timeoutError;
      }
      throw error;
    }
    throw error;
  } finally {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
  }
}
