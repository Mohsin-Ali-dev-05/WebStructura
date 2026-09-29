import { apiRequest } from './api.js';

export function getHealth() {
  return apiRequest('/api/health');
}
