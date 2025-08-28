// frontend/src/api/api.js

import axios from 'axios';

// ✅ Create an Axios instance with base API URL
const API = axios.create({
  baseURL: 'http://localhost:5050/api', // Update this to your deployment URL if needed
});

// ✅ Attach JWT token from localStorage to all outgoing requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('broboard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle error before request is sent
    return Promise.reject(error);
  }
);

export default API;

