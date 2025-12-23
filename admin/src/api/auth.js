import api from './client';

export const loginAdmin = async ({ email, password }) => {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data;
};

export const logoutAdmin = async (refreshToken) => {
  try {
    await api.post('/api/auth/logout', { refreshToken });
  } catch (err) {
    // ignore logout errors to avoid blocking UX
    console.warn('Logout failed', err?.message || err);
  }
};
