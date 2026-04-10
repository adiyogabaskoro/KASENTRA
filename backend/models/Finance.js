// models/Finance.js
// Catatan keuangan manual (halaman Keuangan)

const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema(
  {
    // Tanggal transaksi keuangan
    date: {
      type: Date,
      required: [true, 'Tanggal harus diisi'],
      default: Date.now,
    },

    // Kategori (Modal, Penjualan, Operasional, Restok)
    category: {
      type: String,
      required: [true, 'Kategori harus diisi'],
      enum: ['Modal', 'Penjualan', 'Operasional', 'Restok', 'Lainnya'],
    },

    // Tipe: uang masuk atau keluar
    type: {
      type: String,
      required: [true, 'Tipe harus diisi'],
      enum: ['Masuk', 'Keluar'],
    },

    // Jumlah uang
    amount: {
      type: Number,
      required: [true, 'Jumlah harus diisi'],
      min: [0, 'Jumlah tidak boleh negatif'],
    },

    // Keterangan
    desc: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Finance = mongoose.model('Finance', financeSchema);
module.exports = Finance;