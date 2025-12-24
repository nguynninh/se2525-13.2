import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://api.hiki.io.vn').replace(/\/$/, '');
const API_PREFIX = 'api';

const getStoredToken = () => localStorage.getItem('accessToken') || localStorage.getItem('token');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers || {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    const message = response?.data?.message || error.message || 'Request failed';
    const wrappedError = new Error(message);
    wrappedError.status = response?.status;
    wrappedError.data = response?.data;
    throw wrappedError;
  },
);

export const apiRequest = async (path, options = {}) => {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const hasPrefix = normalizedPath.startsWith(`${API_PREFIX}/`);
  const url = hasPrefix ? normalizedPath : `${API_PREFIX}/${normalizedPath}`;
  const method = (options.method || 'get').toLowerCase();

  const config = {
    url,
    method,
    headers: options.headers,
    params: options.params,
  };

  if (options.body !== undefined) {
    config.data = options.body;
  }

  const response = await api(config);
  return response.data;
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

export default api;
