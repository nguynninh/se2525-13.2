import { apiRequest } from './client';

export const registerDeviceToken = (token) =>
  apiRequest('/user/me/device-tokens', {
    method: 'post',
    body: { token },
  });

export const deleteDeviceToken = (token) =>
  apiRequest('/user/me/device-tokens', {
    method: 'delete',
    body: { token },
  });
