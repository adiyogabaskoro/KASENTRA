// controllers/userController.js
const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    // Jangan tampilkan owner itu sendiri
    const users = await User.find({ role: { $in: ['kasir', 'operator'] } });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, username, password, role } = req.body;

    if (!name || !username || !password || !role) {
      return res.status(400).json({ success: false, message: 'Semua field harus diisi' });
    }

    const user = await User.create({ name, username, password, role });

    res.status(201).json({
      success: true,
      message: 'Akun berhasil dibuat',
      data: { id: user._id, name: user.name, username: user.username, role: user.role },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Username sudah terdaftar' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    res.json({ success: true, message: 'Akun berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

    user.status = !user.status; // Toggle true/false
    await user.save();

    res.json({
      success: true,
      message: `Akun berhasil ${user.status ? 'diaktifkan' : 'dinonaktifkan'}`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

    user.password = newPassword;
    await user.save(); // Hook di model akan otomatis enkripsi

    res.json({ success: true, message: 'Password berhasil direset' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, createUser, deleteUser, toggleUserStatus, resetUserPassword };