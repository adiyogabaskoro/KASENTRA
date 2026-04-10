// middleware/authMiddleware.js
// Cek apakah user sudah login dengan JWT token
// Dipakai di route yang butuh autentikasi

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware: protect - cek apakah ada token valid
const protect = async (req, res, next) => {
  let token;

  // Ambil token dari header "Authorization: Bearer TOKEN"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Ambil bagian setelah "Bearer "
  }

  // Jika tidak ada token, tolak request
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Silakan login terlebih dahulu.',
    });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan data user ke req.user agar bisa diakses di controller
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan.',
      });
    }

    next(); // Lanjut ke controller
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau sudah kadaluarsa.',
    });
  }
};

// Middleware: authorize - cek role user
// Contoh penggunaan: authorize('owner', 'kasir')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' tidak memiliki akses ke resource ini.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };