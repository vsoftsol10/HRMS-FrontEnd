// services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://hrms-backend-production-abd6.up.railway.appapi',
  headers: { 'Content-Type': 'application/json' }
});
