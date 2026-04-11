// ============================================================
// KASENTRA — src/services/api.js  [FIXED v2]
// ============================================================

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;


// ============================================================
// AUTH API
// ============================================================
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getMe: () => api.get('/auth/me'),
  // FIX: Gunakan endpoint yang benar untuk ganti password
  changePassword: (data) => api.put('/auth/change-password', data),
};


// ============================================================
// PRODUCT API
// ============================================================
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (formData) =>
    api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, formData) =>
    api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/products/${id}`),
  // FIX: Endpoint yang benar adalah PUT /:id/add-stock (bukan PATCH /:id/stock)
  addStock: (id, data) => api.put(`/products/${id}/add-stock`, data),
};


// ============================================================
// CATEGORY API
// ============================================================
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};


// ============================================================
// TRANSACTION API
// ============================================================
export const transactionAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  create: (data) => api.post('/transactions', data),
  getById: (id) => api.get(`/transactions/${id}`),
  // FIX: Tambahkan dashboard stats yang sebelumnya tidak dipakai
  getDashboardStats: () => api.get('/transactions/dashboard-stats'),
};


// ============================================================
// FINANCE API
// ============================================================
export const financeAPI = {
  getAll: (params) => api.get('/finance', { params }),
  create: (data) => api.post('/finance', data),
  // FIX: update finance sudah ada di backend — dipakai di Keuangan.jsx (baru)
  update: (id, data) => api.put(`/finance/${id}`, data),
  delete: (id) => api.delete(`/finance/${id}`),
};


// ============================================================
// USER API
// ============================================================
export const userAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  delete: (id) => api.delete(`/users/${id}`),
  // FIX: Method harus PUT bukan PATCH, sesuai route backend
  toggleStatus: (id) => api.put(`/users/${id}/toggle-status`),
  // FIX: URL yang benar untuk reset password
  resetPassword: (id, data) => api.put(`/users/${id}/reset-password`, data),
};


// ============================================================
// STORE SETTING API
// ============================================================
export const settingAPI = {
  get: () => api.get('/settings'),
  // FIX: update setting (tanpa logo) pakai JSON biasa
  update: (data) => api.put('/settings', data),
  // FIX: Upload logo menggunakan endpoint terpisah PUT /settings/logo
  updateLogo: (formData) =>
    api.put('/settings/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  toggleStatus: () => api.put('/settings/toggle-status'),
};
