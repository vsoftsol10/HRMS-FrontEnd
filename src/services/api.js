// services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://vsofthrms-production.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' }
});
