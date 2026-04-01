const s = require('./laporan.service');

const dashboard        = async (req, res, next) => { try { res.json({ success: true, data: await s.dashboard(req.user.tokoId) }); } catch (e) { next(e); } };
const laporanPenjualan = async (req, res, next) => { try { res.json({ success: true, data: await s.laporanPenjualan(req.user.tokoId, req.query) }); } catch (e) { next(e); } };
const laporanKeuangan  = async (req, res, next) => { try { res.json({ success: true, data: await s.laporanKeuangan(req.user.tokoId, req.query) }); } catch (e) { next(e); } };

module.exports = { dashboard, laporanPenjualan, laporanKeuangan };