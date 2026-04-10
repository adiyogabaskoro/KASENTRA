// server.js
// ==========================================
// INI adalah "pintu masuk" aplikasi backend kamu
// Semua dimulai dari sini
// ==========================================

// 1. Import semua package yang dibutuhkan
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 2. Import koneksi database
const connectDB = require('./config/db');

// 3. Import semua routes (daftar URL/endpoint)
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const financeRoutes = require('./routes/financeRoutes');
const userRoutes = require('./routes/userRoutes');
const settingRoutes = require('./routes/settingRoutes');

// 4. Import error handler
const { errorHandler } = require('./middleware/errorMiddleware');

// 5. Load variabel dari file .env
dotenv.config();

// 6. Hubungkan ke MongoDB
connectDB();

// 7. Buat aplikasi Express
const app = express();

// ==========================================
// MIDDLEWARE GLOBAL
// Middleware = fungsi yang dijalankan SEBELUM request sampai ke controller
// ==========================================

// Izinkan request dari frontend React (localhost:5173)
// CORS: izinkan beberapa origin (local dev + production Vercel)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,        // set di .env backend (wajib saat deploy)
  process.env.FRONTEND_URL_PROD,   // opsional: URL Vercel production
].filter(Boolean); // hapus nilai null/undefined

app.use(cors({
  origin: (origin, callback) => {
    // Izinkan request tanpa origin (Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

// Izinkan server membaca JSON dari body request
app.use(express.json());

// Izinkan server membaca form data
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROUTES (Daftar URL / Endpoint API)
// Semua request ke /api/auth → pergi ke authRoutes
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingRoutes);

// Route test - untuk mengecek apakah server berjalan
app.get('/', (req, res) => {
  res.json({ message: '✅ Kasentra API berjalan dengan baik!' });
});

// Error handler harus selalu di PALING BAWAH
app.use(errorHandler);

// ==========================================
// JALANKAN SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server Kasentra berjalan di http://localhost:${PORT}`);
});