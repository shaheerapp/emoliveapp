import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import envVar from '../config/envVar';
const axiosInstance = axios.create({
  baseURL: envVar.API_URL,
  timeout: 35000,
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async config => {
    // Add token to request headers
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Accept = 'application/json';
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// // Add a response interceptor
// axiosInstance.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response) {
//       // console.log('Error Response:', error.response.data);
//       return Promise.reject(error.response.data);
//     } else if (error.request) {
//       console.log('server not responding at the moment');
//       return Promise.reject(error.request);
//       // return Promise.reject(error.request);
//       //   console.log('No Response:', error.request);
//     } else {
//       return Promise.reject(error.message);
//       //   console.log('Error:', error.message);
//     }
//     return Promise.reject(error);
//   },
// );

axiosInstance.interceptors.response.use(
  response => {
    // Return the successful response directly
    return response;
  },
  error => {
    // Handle errors
    let errorMessage = 'An unexpected error occurred. Please try again later.';

    if (error.response) {
      // Server responded with a status code outside 2xx
      const {data, status} = error.response;

      if (data && data.message) {
        // Use the error message from the server
        errorMessage = data.message;
      } else if (status === 401) {
        errorMessage = 'Unauthorized: Please log in again.';
      } else if (status === 404) {
        errorMessage = 'Resource not found.';
      } else if (status === 500) {
        errorMessage = 'Server error: Please try again later.';
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage =
        'No response from the server. Please check your network connection.';
    } else {
      // Something happened in setting up the request
      errorMessage = error.message || 'Request setup error.';
    }

    // Return a consistent error object
    return Promise.reject({
      message: errorMessage,
      code: error.response?.status || 'NO_RESPONSE',
      data: error.response?.data || null,
    });
  },
);

export default axiosInstance;
