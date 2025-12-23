import api from './client';

export const loginSeller = async ({ email, password }) => {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data;
};

export const logoutSeller = async (refreshToken) => {
  try {
    await api.post('/api/auth/logout', { refreshToken });
  } catch (err) {
    // ignore logout errors to avoid blocking UX
    console.warn('Seller logout failed', err?.message || err);
  }
};
