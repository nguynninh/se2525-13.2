import { apiRequest } from './client';

export const loginSeller = async ({ email, password }) => {
  const res = await apiRequest('/auth/login', { method: 'post', body: { email, password } });
  const payload = res?.data ?? res;
  return payload;
};

export const logoutSeller = async (refreshToken) => {
  try {
    await apiRequest('/auth/logout', { method: 'post', body: { refreshToken } });
  } catch (err) {
    console.warn('Seller logout failed', err?.message || err);
  }
};
