const router = require('express').Router();
const auth = require('../../middlewares/auth');
const c = require('./produk.controller');

router.get('/kategori',        auth, c.getAllKategori);
router.post('/kategori',       auth, c.createKategori);
router.delete('/kategori/:id', auth, c.deleteKategori);

router.get('/',     auth, c.getAll);
router.post('/',    auth, c.create);
router.get('/:id',  auth, c.getById);
router.put('/:id',  auth, c.update);
router.delete('/:id', auth, c.remove);

module.exports = router;