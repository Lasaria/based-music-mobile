import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3001', // Replace with your API base URL
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Perform actions before the request is sent
    // Example: Add authorization headers or modify config
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Perform actions with response data
    return response;
  },
  (error) => {
    // Handle response error
    return Promise.reject(error);
  }
);

export default api;
