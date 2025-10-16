import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api/v1'
});

// This interceptor will run before every single request user makes using this API instance.
API.interceptors.request.use((req) => {
  // Check if an auth token exists in localStorage
  const token = localStorage.getItem('authToken');
  
  if (token) {
    // If it exists, add the 'Authorization: Bearer <token>' header to the request
    req.headers.Authorization = `Bearer ${token}`;
  }
  
  return req;
});

export default API;