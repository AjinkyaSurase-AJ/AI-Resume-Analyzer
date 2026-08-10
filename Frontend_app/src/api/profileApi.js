import apiClient from './apiClient';

export const getProfile = async () => {
  const response = await apiClient.get('/users/profile');
  return response.data;
};

export const updateProfile = async (profile) => {
  const response = await apiClient.patch('/users/profile', profile);
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await apiClient.put('/users/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};
