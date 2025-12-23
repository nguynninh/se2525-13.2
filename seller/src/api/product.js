import { apiRequest, buildQueryString } from './client';

// Categories (server mounts productRoute at '/'; endpoint is /api/categories)
export const fetchCategories = () => apiRequest('/categories');
export const createCategory = (payload) =>
  apiRequest('/categories', {
    method: 'post',
    body: payload,
  });
export const updateCategory = (id, payload) =>
  apiRequest(`/categories/${id}`, {
    method: 'patch',
    body: payload,
  });
export const deleteCategory = (id) =>
  apiRequest(`/categories/${id}`, {
    method: 'delete',
  });

// Products
export const fetchProducts = (filters = {}) => {
  const query = buildQueryString(filters);
  return apiRequest(`/products${query}`);
};

export const fetchProductDetail = (id) => apiRequest(`/products/${id}`);

export const createProduct = (payload) =>
  apiRequest('/products', {
    method: 'post',
    body: payload,
  });

export const updateProduct = (id, payload) =>
  apiRequest(`/products/${id}`, {
    method: 'patch',
    body: payload,
  });

export const deleteProduct = (id) =>
  apiRequest(`/products/${id}`, {
    method: 'delete',
  });

// Product assets / variants / stock
export const uploadProductImage = (payload) =>
  apiRequest('/products/images', {
    method: 'post',
    body: payload,
  });

export const createVariantAttribute = (payload) =>
  apiRequest('/products/variants', {
    method: 'post',
    body: payload,
  });

export const createVariantOption = (payload) =>
  apiRequest('/products/variants/options', {
    method: 'post',
    body: payload,
  });

export const createProductStock = (payload) =>
  apiRequest('/products/stocks', {
    method: 'post',
    body: payload,
  });

export const updateProductStock = (id, payload) =>
  apiRequest(`/products/stocks/${id}`, {
    method: 'patch',
    body: payload,
  });

// Questions & reviews
export const fetchProductQuestions = (productId) => apiRequest(`/products/${productId}/questions`);

export const fetchProductReviews = (productId) => apiRequest(`/products/${productId}/reviews`);

export const answerProductQuestion = (questionId, payload) =>
  apiRequest(`/products/questions/${questionId}/answer`, {
    method: 'patch',
    body: payload,
  });

export const createProductQuestion = (payload) =>
  apiRequest('/products/questions', {
    method: 'post',
    body: payload,
  });

export const createProductReview = (payload) =>
  apiRequest('/products/reviews', {
    method: 'post',
    body: payload,
  });
