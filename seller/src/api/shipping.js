import { apiRequest, buildQueryString } from './client';

// Note: shipments/shipping-rates endpoints on server are admin-only.
// For seller portal, return empty arrays to avoid 403/404 from admin endpoints.
export const fetchShipments = async () => [];
export const fetchShippingRates = async () => [];

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

// The following are admin-only on backend; keep no-op to avoid accidental calls from seller UI.
export const createShipment = async () => {
  throw new Error('Shipments are managed by admin');
};

export const updateShipmentStatus = async () => {
  throw new Error('Shipments are managed by admin');
};

export const updateShippingRate = async () => {
  throw new Error('Shipping rates are managed by admin');
};
