import { apiRequest } from './client';

export const logout = () =>
  apiRequest('/auth/logout', {
    method: 'post',
  });
