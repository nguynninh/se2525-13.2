import { apiRequest, buildQueryString } from './client';

export const fetchShipments = (params = {}) => {
  const query = buildQueryString(params);
  return apiRequest(`/shipments${query}`);
};

export const fetchShippingRates = () => apiRequest('/shipping-rates');

export const fetchMyAddresses = () => apiRequest('/user/me/shipping-addresses');

export const createMyAddress = (payload) =>
  apiRequest('/user/me/shipping-addresses', {
    method: 'post',
    body: payload,
  });

export const updateMyAddress = (id, payload) =>
  apiRequest(`/user/me/shipping-addresses/${id}`, {
    method: 'patch',
    body: payload,
  });

export const deleteMyAddress = (id) =>
  apiRequest(`/user/me/shipping-addresses/${id}`, {
    method: 'delete',
  });

export const setDefaultMyAddress = (id) =>
  apiRequest(`/user/me/shipping-addresses/${id}/default`, {
    method: 'patch',
  });

export const fetchProvinces = () => apiRequest('/location/provinces');

export const fetchWards = (provinceCode) => apiRequest(`/location/provinces/${provinceCode}/wards`);

export const createShipment = (payload) =>
  apiRequest('/shipments', {
    method: 'post',
    body: payload,
  });

export const updateShipmentStatus = (id, payload) =>
  apiRequest(`/shipments/${id}/status`, {
    method: 'patch',
    body: payload,
  });

export const updateShippingRate = (id, payload) =>
  apiRequest(`/shipping-rates/${id}`, {
    method: 'patch',
    body: payload,
  });
