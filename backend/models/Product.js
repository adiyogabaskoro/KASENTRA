// models/Product.js
// Data produk / inventory

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // Nama produk
    name: {
      type: String,
      required: [true, 'Nama produk harus diisi'],
      trim: true,
    },

    // ID item kustom (misal: ITEM-001)
    idItem: {
      type: String,
      unique: true,
      sparse: true, // Boleh null, tapi kalau ada harus unik
    },

    // Kategori (referensi ke model Category)
    category: {
      type: mongoose.Schema.Types.ObjectId, // ID dari Category
      ref: 'Category',                       // Link ke model Category
      required: [true, 'Kategori harus dipilih'],
    },

    // Harga jual (yang terlihat di kasir)
    hargaJual: {
      type: Number,
      required: [true, 'Harga jual harus diisi'],
      min: [0, 'Harga tidak boleh negatif'],
    },

    // Harga beli (modal)
    hargaBeli: {
      type: Number,
      default: 0,
      min: [0, 'Harga tidak boleh negatif'],
    },

    // Jumlah stok
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stok tidak boleh negatif'],
    },

    // Tanggal kadaluarsa
    tanggalExpired: {
      type: Date,
      default: null,
    },

    // URL gambar produk dari Cloudinary
    image: {
      type: String,
      default: '',
    },

    // Public ID gambar dari Cloudinary (untuk hapus gambar lama)
    imagePublicId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;