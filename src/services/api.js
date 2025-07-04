// services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://hrms-three-tau.vercel.appapi',
  headers: { 'Content-Type': 'application/json' }
});
