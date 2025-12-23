import { apiRequest, buildQueryString } from './client';

// Categories
export const fetchCategories = () => apiRequest('/product/categories');
export const createCategory = (payload) =>
  apiRequest('/product/categories', {
    method: 'post',
    body: payload,
  });
export const updateCategory = (id, payload) =>
  apiRequest(`/product/categories/${id}`, {
    method: 'patch',
    body: payload,
  });
export const deleteCategory = (id) =>
  apiRequest(`/product/categories/${id}`, {
    method: 'delete',
  });

// Products
export const fetchProducts = (filters = {}) => {
  const query = buildQueryString(filters);
  return apiRequest(`/product/products${query}`);
};

export const fetchProductDetail = (id) => apiRequest(`/product/products/${id}`);

export const createProduct = (payload) =>
  apiRequest('/product/products', {
    method: 'post',
    body: payload,
  });

export const updateProduct = (id, payload) =>
  apiRequest(`/product/products/${id}`, {
    method: 'patch',
    body: payload,
  });

export const deleteProduct = (id) =>
  apiRequest(`/product/products/${id}`, {
    method: 'delete',
  });

// Product assets / variants / stock
export const uploadProductImage = (payload) =>
  apiRequest('/product/products/images', {
    method: 'post',
    body: payload,
  });

export const createVariantAttribute = (payload) =>
  apiRequest('/product/products/variants', {
    method: 'post',
    body: payload,
  });

export const createVariantOption = (payload) =>
  apiRequest('/product/products/variants/options', {
    method: 'post',
    body: payload,
  });

export const createProductStock = (payload) =>
  apiRequest('/product/products/stocks', {
    method: 'post',
    body: payload,
  });

export const updateProductStock = (id, payload) =>
  apiRequest(`/product/products/stocks/${id}`, {
    method: 'patch',
    body: payload,
  });

// Questions & reviews
export const fetchProductQuestions = (productId) => apiRequest(`/product/products/${productId}/questions`);

export const fetchProductReviews = (productId) => apiRequest(`/product/products/${productId}/reviews`);

export const answerProductQuestion = (questionId, payload) =>
  apiRequest(`/product/products/questions/${questionId}/answer`, {
    method: 'patch',
    body: payload,
  });

export const createProductQuestion = (payload) =>
  apiRequest('/product/products/questions', {
    method: 'post',
    body: payload,
  });

export const createProductReview = (payload) =>
  apiRequest('/product/products/reviews', {
    method: 'post',
    body: payload,
  });
