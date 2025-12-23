import api from './client';

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query.append(key, value);
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
};

export const fetchNotifications = async (params = {}) => {
  const query = buildQueryString(params);
  const { data } = await api.get(`/api/notifications${query}`);
  return data;
};

export const markNotificationRead = async (id) => {
  const { data } = await api.patch(`/api/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await api.patch('/api/notifications/read-all');
  return data;
};

export default {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};
