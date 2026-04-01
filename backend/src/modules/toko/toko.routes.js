const router = require('express').Router();
const auth = require('../../middlewares/auth');
const { getToko, updateToko } = require('./toko.controller');

router.get('/',    auth, getToko);
router.put('/',    auth, updateToko);

module.exports = router;