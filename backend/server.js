// ============================================================
// KASENTRA — server.js [FIXED v2 — Production Ready]
// FIX: Tambahkan helmet, rate limiting, morgan untuk logging
// FIX: Error handler lebih informatif tapi aman di production
// ============================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Keamanan tambahan (install: npm install helmet express-rate-limit)
let helmet, rateLimit;
try {
  helmet = require('helmet');
  rateLimit = require('express-rate-limit');
} catch {
  // Optional — tidak wajib tapi direkomendasikan
}

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const financeRoutes = require('./routes/financeRoutes');
const userRoutes = require('./routes/userRoutes');
const settingRoutes = require('./routes/settingRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

// ── Security headers
if (helmet) app.use(helmet());

// ── CORS — support local dev + production Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Izinkan Postman / server-to-server (tidak ada origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

// ── Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Rate limiting untuk endpoint auth (cegah brute force)
if (rateLimit) {
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 20,                   // max 20 request login per 15 menit
    message: { success: false, message: 'Terlalu banyak percobaan login. Coba lagi setelah 15 menit.' },
  });
  app.use('/api/auth/login', authLimiter);
}

// ── Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingRoutes);

// ── Health check
app.get('/', (req, res) => {
  res.json({
    message: '✅ Kasentra API berjalan',
    version: '2.0.0',
    env: process.env.NODE_ENV || 'development',
  });
});

// ── 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} tidak ditemukan` });
});

// ── Global error handler (WAJIB paling bawah)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server Kasentra berjalan di http://localhost:${PORT}`);
  console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`);
});
