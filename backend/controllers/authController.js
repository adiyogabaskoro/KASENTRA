// controllers/authController.js
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Fungsi helper: buat JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload: simpan ID user di dalam token
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE } // Expired dalam 7 hari
  );
};

// ==========================================
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public (tidak perlu login)
// ==========================================
const login = async (req, res) => {
  // Cek apakah ada error validasi
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }

  const { username, password, role } = req.body;

  try {
    // Cari user berdasarkan username
    // .select('+password') karena password di schema pakai "select: false"
    const user = await User.findOne({ username }).select('+password');

    // Jika user tidak ada
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Username tidak terdaftar',
      });
    }

    // Cek apakah role cocok
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: 'Role tidak sesuai untuk akun ini',
      });
    }

    // Cek apakah akun aktif
    if (!user.status) {
      return res.status(401).json({
        success: false,
        message: 'Akun kamu dinonaktifkan. Hubungi owner.',
      });
    }

    // Cek password menggunakan method yang kita buat di model
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Password salah',
      });
    }

    // Login berhasil! Buat token dan kirim response
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server: ' + error.message,
    });
  }
};

// ==========================================
// @desc    Ambil data user yang sedang login
// @route   GET /api/auth/me
// @access  Private (butuh token)
// ==========================================
const getMe = async (req, res) => {
  // req.user sudah diisi oleh middleware "protect"
  res.json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      username: req.user.username,
      role: req.user.role,
      avatar: req.user.avatar,
    },
  });
};

// ==========================================
// @desc    Ganti password sendiri
// @route   PUT /api/auth/change-password
// @access  Private
// ==========================================
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Ambil user dengan password
    const user = await User.findById(req.user._id).select('+password');

    // Cek password lama
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Password saat ini tidak sesuai',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password baru minimal 6 karakter',
      });
    }

    // Update password (enkripsi otomatis via hook di model)
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password berhasil diubah',
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { login, getMe, changePassword };