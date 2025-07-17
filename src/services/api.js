// services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://hrms-backend-5wau.onrender.com//api',
  headers: { 'Content-Type': 'application/json' }
});
