import { apiRequest } from './client';

export const fetchFavoriteShops = () => apiRequest('/shop/favorites');

export const addFavoriteShop = (shopId) =>
  apiRequest('/shop/favorites', {
    method: 'post',
    body: { shopId },
  });

export const deleteFavoriteShop = (shopId) =>
  apiRequest(`/shop/favorites/${shopId}`, {
    method: 'delete',
  });
