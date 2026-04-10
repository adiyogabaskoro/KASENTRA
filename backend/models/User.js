// models/User.js
// Data untuk semua akun pengguna (Owner, Kasir, Operator)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Nama lengkap pengguna
    name: {
      type: String,
      required: [true, 'Nama harus diisi'],
      trim: true, // Hapus spasi di awal/akhir
    },

    // Username untuk login (harus unik)
    username: {
      type: String,
      required: [true, 'Username harus diisi'],
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Password (akan di-enkripsi sebelum disimpan)
    password: {
      type: String,
      required: [true, 'Password harus diisi'],
      minlength: [6, 'Password minimal 6 karakter'],
      select: false, // Password TIDAK akan muncul saat query (keamanan)
    },

    // Role pengguna
    role: {
      type: String,
      enum: ['owner', 'kasir', 'operator'], // Hanya 3 pilihan ini
      default: 'kasir',
    },

    // Status akun (aktif/nonaktif)
    status: {
      type: Boolean,
      default: true,
    },

    // URL foto profil dari Cloudinary
    avatar: {
      type: String,
      default: '',
    },

    // Public ID dari Cloudinary (untuk hapus gambar lama)
    avatarPublicId: {
      type: String,
      default: '',
    },
  },
  {
    // Otomatis tambah field createdAt dan updatedAt
    timestamps: true,
  }
);

// ==========================================
// HOOK: Enkripsi password SEBELUM disimpan
// Hook ini berjalan otomatis setiap kali .save() dipanggil
// ==========================================
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await require('bcryptjs').genSalt(10);
  this.password = await require('bcryptjs').hash(this.password, salt);
});

// ==========================================
// METHOD: Cocokkan password saat login
// Dipanggil dengan: user.matchPassword(passwordYangDimasukkan)
// ==========================================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;