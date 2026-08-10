import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import config from '../utils/config';

const apiClient = axios.create({
  baseURL: config.BASE_URL,
  timeout: 30000,
});

apiClient.interceptors.request.use(async (request) => {
  const token = await AsyncStorage.getItem(config.KEY_TOKEN);

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

export const getApiErrorMessage = (error, fallbackMessage) => {
  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please try again.';
  }

  if (!error.response) {
    return 'Unable to connect to the server. Check your network connection.';
  }

  return error.response.data?.message || fallbackMessage;
};

export default apiClient;
