const s = require('./inventory.service');

const getMutasi   = async (req, res, next) => { try { res.json({ success: true, data: await s.getMutasi(req.user.tokoId, req.query) }); } catch (e) { next(e); } };
const tambahStok  = async (req, res, next) => { try { res.status(201).json({ success: true, data: await s.tambahStok(req.user.tokoId, req.user.id, req.body) }); } catch (e) { next(e); } };

module.exports = { getMutasi, tambahStok };