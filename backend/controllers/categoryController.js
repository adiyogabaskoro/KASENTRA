// controllers/categoryController.js
const Category = require('../models/Category');

// GET semua kategori
const getCategories = async (req, res) => {
  try {
    // populate('itemCount') mengisi field virtual itemCount
    const categories = await Category.find().populate('itemCount').sort({ name: 1 });

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST buat kategori baru
const createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Nama kategori harus diisi' });
  }

  try {
    const category = await Category.create({ name, description });
    res.status(201).json({ success: true, message: 'Kategori berhasil ditambahkan', data: category });
  } catch (error) {
    // Cek apakah error karena nama duplikat
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Nama kategori sudah ada' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT edit kategori
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, description: req.body.description },
      { new: true, runValidators: true } // new: true = return data setelah update
    );

    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }

    res.json({ success: true, message: 'Kategori berhasil diperbarui', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE hapus kategori
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }

    res.json({ success: true, message: 'Kategori berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };