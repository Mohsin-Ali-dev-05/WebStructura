import { apiRequest } from './api.js';

export function registerUser({ name, email, password }) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function loginUser({ email, password }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function fetchCurrentUser() {
  return apiRequest('/api/auth/me');
}

export function updateProfile({ displayName, name, email }) {
  return apiRequest('/api/users/me', {
    method: 'PUT',
    body: JSON.stringify({
      displayName: displayName || name,
      email,
    }),
  });
}

export function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);

  return apiRequest('/api/users/me/avatar', {
    method: 'POST',
    body: formData,
    timeoutMs: 60_000,
  });
}

export function deleteAvatar() {
  return apiRequest('/api/users/me/avatar', {
    method: 'DELETE',
  });
}

export function changePassword({ currentPassword, newPassword }) {
  return apiRequest('/api/users/me/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export function forgotPassword({ email }) {
  return apiRequest('/api/auth/forgotpassword', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPassword({ token, password }) {
  return apiRequest(`/api/auth/resetpassword/${encodeURIComponent(token)}`, {
    method: 'PUT',
    body: JSON.stringify({ password }),
  });
}
