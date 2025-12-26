import { apiRequest } from './client';

export const loginSeller = async ({ email, password }) => {
  const res = await apiRequest('/auth/login', { method: 'post', body: { email, password } });
  const payload = res?.data ?? res;
  return payload;
};

export const requestPasswordReset = async (email) => {
  const res = await apiRequest('/auth/reset/request', { method: 'post', body: { email } });
  return res?.data ?? res;
};

export const resendPasswordReset = async (email) => {
  const res = await apiRequest('/auth/reset/resend', { method: 'post', body: { email } });
  return res?.data ?? res;
};

export const verifyPasswordReset = async (code) => {
  const res = await apiRequest('/auth/reset/verify', { method: 'post', body: { code } });
  return res?.data ?? res;
};

export const finalizePasswordReset = async ({ code, new_password, confirm_password }) => {
  const res = await apiRequest('/auth/reset/finalize', {
    method: 'post',
    body: { code, new_password, confirm_password },
  });
  return res?.data ?? res;
};

export const logoutSeller = async (refreshToken) => {
  try {
    await apiRequest('/auth/logout', { method: 'post', body: { refreshToken } });
  } catch (err) {
    console.warn('Seller logout failed', err?.message || err);
  }
};
