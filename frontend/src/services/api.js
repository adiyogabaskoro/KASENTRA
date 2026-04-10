// ============================================================
// KASENTRA — src/services/api.js
// Axios instance terpusat untuk semua request ke backend
// ============================================================

import axios from 'axios';

// Ambil base URL dari .env (VITE_API_URL=http://localhost:5000/api)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Buat instance axios dengan config default
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// REQUEST INTERCEPTOR
// Otomatis tambahkan token JWT ke setiap request
// ============================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// RESPONSE INTERCEPTOR
// Handle token expired (401) secara otomatis
// ============================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau tidak valid — paksa logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect ke halaman login
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
  // Login — kirim username, password, role ke backend
  login: (data) => api.post('/auth/login', data),

  // Logout (opsional — hapus token di localStorage)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Ambil data user yang sedang login
  getMe: () => api.get('/auth/me'),
};


// ============================================================
// PRODUCT API
// ============================================================
export const productAPI = {
  // Ambil semua produk (bisa dengan filter/search)
  getAll: (params) => api.get('/products', { params }),

  // Ambil 1 produk berdasarkan ID
  getById: (id) => api.get(`/products/${id}`),

  // Tambah produk baru (dengan gambar — gunakan FormData)
  create: (formData) =>
    api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Edit produk
  update: (id, formData) =>
    api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Hapus produk
  delete: (id) => api.delete(`/products/${id}`),

  // Update stok saja
  updateStock: (id, data) => api.patch(`/products/${id}/stock`, data),
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
  // Ambil semua transaksi (bisa filter by tanggal, dll)
  getAll: (params) => api.get('/transactions', { params }),

  // Buat transaksi baru (saat kasir checkout)
  create: (data) => api.post('/transactions', data),

  // Ambil detail 1 transaksi
  getById: (id) => api.get(`/transactions/${id}`),
};


// ============================================================
// FINANCE API (Keuangan manual)
// ============================================================
export const financeAPI = {
  getAll: (params) => api.get('/finance', { params }),
  create: (data) => api.post('/finance', data),
  update: (id, data) => api.put(`/finance/${id}`, data),
  delete: (id) => api.delete(`/finance/${id}`),
};


// ============================================================
// USER / OPERATOR API
// ============================================================
export const userAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  toggleStatus: (id) => api.patch(`/users/${id}/toggle-status`),
};


// ============================================================
// STORE SETTING API
// ============================================================
export const settingAPI = {
  get: () => api.get('/settings'),
  update: (formData) =>
    api.put('/settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  toggleStatus: (data) => api.put('/settings/toggle-status', data), // PUT sesuai route backend
};