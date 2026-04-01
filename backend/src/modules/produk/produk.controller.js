const s = require('./produk.service');

const getAll          = async (req, res, next) => { try { res.json({ success: true, data: await s.getAll(req.user.tokoId, req.query) }); } catch (e) { next(e); } };
const getById         = async (req, res, next) => { try { res.json({ success: true, data: await s.getById(req.params.id, req.user.tokoId) }); } catch (e) { next(e); } };
const create          = async (req, res, next) => { try { res.status(201).json({ success: true, data: await s.create(req.user.tokoId, req.body) }); } catch (e) { next(e); } };
const update          = async (req, res, next) => { try { res.json({ success: true, data: await s.update(req.params.id, req.user.tokoId, req.body) }); } catch (e) { next(e); } };
const remove          = async (req, res, next) => { try { res.json({ success: true, message: 'Produk dinonaktifkan' }); await s.remove(req.params.id, req.user.tokoId); } catch (e) { next(e); } };
const getAllKategori   = async (req, res, next) => { try { res.json({ success: true, data: await s.getAllKategori(req.user.tokoId) }); } catch (e) { next(e); } };
const createKategori  = async (req, res, next) => { try { res.status(201).json({ success: true, data: await s.createKategori(req.user.tokoId, req.body) }); } catch (e) { next(e); } };
const deleteKategori  = async (req, res, next) => { try { await s.deleteKategori(req.params.id, req.user.tokoId); res.json({ success: true, message: 'Kategori dihapus' }); } catch (e) { next(e); } };

module.exports = { getAll, getById, create, update, remove, getAllKategori, createKategori, deleteKategori };