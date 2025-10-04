// src/api/auth.api.js
import axios from './axios.config';

export const authAPI = {
  login: (credentials) => axios.post('/auth/login', credentials),
  signup: (userData) => axios.post('/auth/signup', userData)
};