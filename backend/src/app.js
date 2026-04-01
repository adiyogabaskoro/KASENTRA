const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes      = require('./modules/auth/auth.routes');
const tokoRoutes      = require('./modules/toko/toko.routes');
const userRoutes      = require('./modules/user/user.routes');
const produkRoutes    = require('./modules/produk/produk.routes');
const inventoryRoutes = require('./modules/inventory/inventory.routes');
const transaksiRoutes = require('./modules/transaksi/transaksi.routes');
const keuanganRoutes  = require('./modules/keuangan/keuangan.routes');
const laporanRoutes   = require('./modules/laporan/laporan.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', app: 'Kasentra BE' }));

app.use('/api/auth',      authRoutes);
app.use('/api/toko',      tokoRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/produk',    produkRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/keuangan',  keuanganRoutes);
app.use('/api/laporan',   laporanRoutes);

app.use(errorHandler);

module.exports = app;