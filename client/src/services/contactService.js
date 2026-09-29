import { apiRequest } from './api.js';

export function submitContact({ name, email, message }) {
  return apiRequest('/api/contact', {
    method: 'POST',
    body: JSON.stringify({ name, email, message }),
  });
}
