const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1').replace(/\/$/, '');

const getStoredToken = () => localStorage.getItem('accessToken') || localStorage.getItem('token');

export const apiRequest = async (path, options = {}) => {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = new Headers(options.headers || {});
  const hasJsonBody = options.body && !(options.body instanceof FormData) && typeof options.body !== 'string';
  const token = getStoredToken();

  if (hasJsonBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body: hasJsonBody ? JSON.stringify(options.body) : options.body,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = payload?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  return payload;
};

export const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query.append(key, value);
  });

  const qs = query.toString();
  return qs ? `?${qs}` : '';
};
