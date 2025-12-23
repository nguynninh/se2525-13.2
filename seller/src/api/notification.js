import { apiRequest, buildQueryString } from './client';

export const fetchNotifications = (params = {}) => {
  const query = buildQueryString(params);
  return apiRequest(`/notifications${query}`);
};

export const markNotificationRead = (id) =>
  apiRequest(`/notifications/${id}/read`, {
    method: 'patch',
  });

export const markAllNotificationsRead = () =>
  apiRequest('/notifications/read-all', {
    method: 'patch',
  });

export default {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};
