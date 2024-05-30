import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.1.223:8000/api/',
});

// Tambahkan interceptors untuk menambahkan token ke header setiap request
apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('my-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default apiClient;
