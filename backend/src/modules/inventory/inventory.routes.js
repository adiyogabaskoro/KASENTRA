const router = require('express').Router();
const auth = require('../../middlewares/auth');
const { getMutasi, tambahStok } = require('./inventory.controller');

router.get('/',   auth, getMutasi);
router.post('/',  auth, tambahStok);

module.exports = router;