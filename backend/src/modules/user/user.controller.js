const userService = require('./user.service');

const getAll    = async (req, res, next) => { try { res.json({ success: true, data: await userService.getAll(req.user.tokoId) }); } catch (e) { next(e); } };
const create    = async (req, res, next) => { try { res.status(201).json({ success: true, data: await userService.create(req.user.tokoId, req.body) }); } catch (e) { next(e); } };
const update    = async (req, res, next) => { try { res.json({ success: true, data: await userService.update(req.params.id, req.user.tokoId, req.body) }); } catch (e) { next(e); } };
const remove    = async (req, res, next) => { try { res.json({ success: true, message: 'User dinonaktifkan' }); await userService.remove(req.params.id, req.user.tokoId); } catch (e) { next(e); } };

module.exports = { getAll, create, update, remove };