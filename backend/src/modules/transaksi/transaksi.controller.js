const s = require('./transaksi.service');

const bukaSesi        = async (req, res, next) => { try { res.status(201).json({ success: true, data: await s.bukaSesi(req.user.tokoId, req.user.id, req.body) }); } catch (e) { next(e); } };
const tutupSesi       = async (req, res, next) => { try { res.json({ success: true, data: await s.tutupSesi(req.user.tokoId) }); } catch (e) { next(e); } };
const getSesiAktif    = async (req, res, next) => { try { res.json({ success: true, data: await s.getSesiAktif(req.user.tokoId) }); } catch (e) { next(e); } };
const getRiwayatSesi  = async (req, res, next) => { try { res.json({ success: true, data: await s.getRiwayatSesi(req.user.tokoId) }); } catch (e) { next(e); } };
const buatTransaksi   = async (req, res, next) => { try { res.status(201).json({ success: true, data: await s.buatTransaksi(req.user.tokoId, req.user.id, req.body) }); } catch (e) { next(e); } };
const getTransaksi    = async (req, res, next) => { try { res.json({ success: true, data: await s.getTransaksi(req.user.tokoId, req.query) }); } catch (e) { next(e); } };
const getTransaksiById = async (req, res, next) => { try { res.json({ success: true, data: await s.getTransaksiById(req.params.id, req.user.tokoId) }); } catch (e) { next(e); } };

module.exports = { bukaSesi, tutupSesi, getSesiAktif, getRiwayatSesi, buatTransaksi, getTransaksi, getTransaksiById };