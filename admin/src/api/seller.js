import { apiRequest } from './client';

export const getSellerProfile = () => apiRequest('/user/seller/me');

export const getMyShop = () => apiRequest('/shop/me');

export const createMyShop = (payload) =>
  apiRequest('/shop/me', {
    method: 'post',
    body: payload,
  });

export const updateMyShop = (payload) =>
  apiRequest('/shop/me', {
    method: 'patch',
    body: payload,
  });

export const updateMyShopStatus = (payload) =>
  apiRequest('/shop/me/status', {
    method: 'patch',
    body: payload,
  });

export const getSellerOrders = (params = {}) =>
  apiRequest('/user/seller/me/orders', {
    params,
  });

export const getSellerOrderDetail = (id) => apiRequest(`/user/seller/me/orders/${id}`);

export const confirmSellerOrder = (id) =>
  apiRequest(`/user/seller/me/orders/${id}/confirm`, {
    method: 'patch',
  });

export const rejectSellerOrder = (id, payload) =>
  apiRequest(`/user/seller/me/orders/${id}/reject`, {
    method: 'patch',
    body: payload,
  });

export const updateSellerOrderDeliveryStatus = (id, payload) =>
  apiRequest(`/user/seller/me/orders/${id}/status`, {
    method: 'patch',
    body: payload,
  });
