const router = require('express').Router();
const auth = require('../../middlewares/auth');
const c = require('./transaksi.controller');

router.post('/sesi/buka',    auth, c.bukaSesi);
router.post('/sesi/tutup',   auth, c.tutupSesi);
router.get('/sesi/aktif',    auth, c.getSesiAktif);
router.get('/sesi/riwayat',  auth, c.getRiwayatSesi);

router.get('/',      auth, c.getTransaksi);
router.post('/',     auth, c.buatTransaksi);
router.get('/:id',   auth, c.getTransaksiById);

module.exports = router;