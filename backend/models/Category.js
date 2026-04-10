// models/Category.js
// Kategori produk (Makanan, Minuman, dll)

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama kategori harus diisi'],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    // Tambah field virtual "itemCount" yang dihitung dari produk
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field: hitung jumlah produk di kategori ini
// "Virtual" artinya tidak disimpan di DB, dihitung saat query
categorySchema.virtual('itemCount', {
  ref: 'Product',           // Referensi ke model Product
  localField: '_id',        // _id kategori ini
  foreignField: 'category', // cocokkan dengan field "category" di Product
  count: true,              // hitung saja, jangan tampilkan datanya
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;