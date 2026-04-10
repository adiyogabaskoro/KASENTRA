// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, getMe, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Validasi untuk login
const loginValidation = [
  body('username').notEmpty().withMessage('Username harus diisi'),
  body('password').notEmpty().withMessage('Password harus diisi'),
  body('role').isIn(['owner', 'kasir', 'operator']).withMessage('Role tidak valid'),
];

// POST /api/auth/login
router.post('/login', loginValidation, login);

// GET /api/auth/me → ambil data user yang sedang login
router.get('/me', protect, getMe);

// PUT /api/auth/change-password
router.put('/change-password', protect, changePassword);

module.exports = router;