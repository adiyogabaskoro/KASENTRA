const router = require('express').Router();
const auth = require('../../middlewares/auth');
const c = require('./laporan.controller');

router.get('/dashboard',  auth, c.dashboard);
router.get('/penjualan',  auth, c.laporanPenjualan);
router.get('/keuangan',   auth, c.laporanKeuangan);

module.exports = router;