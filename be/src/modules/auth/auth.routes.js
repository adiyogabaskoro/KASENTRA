const router = require('express').Router();
const { register, login, getMe } = require('./auth.controller');
const auth = require('../../middlewares/auth');

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        auth, getMe);

module.exports = router;