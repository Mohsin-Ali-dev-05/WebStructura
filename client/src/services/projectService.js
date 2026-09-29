import { apiRequest } from './api.js';

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

/** Unauthenticated share payload: { name, websiteData } only */
export function getPublicProject(id) {
  return apiRequest(`/api/projects/public/${id}`);
}
