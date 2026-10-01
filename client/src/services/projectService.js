import { API_BASE_URL, apiRequest, getStoredToken } from './api.js';

export function listProjects() {
  return apiRequest('/api/projects');
}

export function getProject(id) {
  return apiRequest(`/api/projects/${id}`);
}

export function createProject(payload, options = {}) {
  // AI website generation on the server can take ~20s; allow generous headroom.
  const timeoutMs =
    typeof options.timeoutMs === 'number' ? options.timeoutMs : 120_000;

  return apiRequest('/api/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
    timeoutMs,
    signal: options.signal,
  });
}

export function updateProject(id, payload) {
  return apiRequest(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteProject(id) {
  return apiRequest(`/api/projects/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Download a Vite + React + Tailwind ZIP for a project (Bearer auth).
 * Returns { blob, filename }.
 */
export async function exportProjectZip(id) {
  const authToken = getStoredToken();

  const response = await fetch(`${API_BASE_URL}/api/projects/${id}/export`, {
    method: 'GET',
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });

  if (!response.ok) {
    let message = `Export failed with status ${response.status}`;
    try {
      const payload = await response.json();
      if (payload?.message) {
        message = payload.message;
      }
    } catch {
      // ZIP error bodies may not be JSON
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  const blob = await response.blob();
  const disposition = response.headers.get('Content-Disposition') || '';
  const match = /filename="?([^"]+)"?/i.exec(disposition);
  const filename = match?.[1] || 'webstructura-export.zip';

  return { blob, filename };
}

/** Unauthenticated share payload: { name, websiteData } only */
export function getPublicProject(id) {
  return apiRequest(`/api/projects/public/${id}`);
}
