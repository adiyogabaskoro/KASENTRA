// models/Transaction.js
// Data setiap transaksi penjualan di kasir

const mongoose = require('mongoose');

// Sub-schema untuk setiap item dalam transaksi
const transactionItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  // Simpan nama produk saat transaksi (kalau produk dihapus nanti, data tetap ada)
  productName: { type: String, required: true },
  // Harga saat transaksi (bisa berubah, ini snapshot)
  hargaJual: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
});

const transactionSchema = new mongoose.Schema(
  {
    // Nomor transaksi unik
    noTransaksi: {
      type: String,
      unique: true,
    },

    // Siapa kasirnya
    kasir: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    kasirName: { type: String },

    // Daftar item yang dibeli
    items: [transactionItemSchema],

    // Perhitungan harga
    subTotal: { type: Number, required: true },
    diskon: { type: Number, default: 0 },
    pajak: { type: Number, default: 0 },
    total: { type: Number, required: true },

    // Metode pembayaran
    paymentMethod: {
      type: String,
      enum: ['tunai', 'qris'],
      required: true,
    },

    // Jumlah uang diterima (untuk pembayaran tunai)
    bayar: { type: Number, default: 0 },
    kembalian: { type: Number, default: 0 },

    // Status transaksi
    status: {
      type: String,
      enum: ['selesai', 'dibatalkan'],
      default: 'selesai',
    },
  },
  {
    timestamps: true,
  }
);

// Buat nomor transaksi otomatis sebelum disimpan
transactionSchema.pre('save', async function (next) {
  if (!this.noTransaksi) {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await mongoose.model('Transaction').countDocuments();
    this.noTransaksi = `TRX-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;