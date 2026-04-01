const router = require('express').Router();
const auth = require('../../middlewares/auth');
const c = require('./keuangan.controller');

router.get('/kategori',        auth, c.getKategori);
router.post('/kategori',       auth, c.createKategori);
router.delete('/kategori/:id', auth, c.deleteKategori);

router.get('/',      auth, c.getAll);
router.post('/',     auth, c.create);
router.delete('/:id', auth, c.remove);

module.exports = router;