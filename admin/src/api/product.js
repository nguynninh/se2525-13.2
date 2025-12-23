import { apiRequest, buildQueryString } from './client';

export const fetchCategories = () => apiRequest('/categories');

export const fetchProducts = (filters = {}) => {
  const query = buildQueryString(filters);
  return apiRequest(`/products${query}`);
};
