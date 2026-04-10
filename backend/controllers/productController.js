// controllers/productController.js
const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// GET semua produk
const getProducts = async (req, res) => {
  try {
    // Query parameter untuk filter dan pencarian
    const { search, category, stockStatus } = req.query;

    let query = {};

    // Filter berdasarkan nama atau kategori
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // 'i' = case-insensitive
    }

    if (category) {
      query.category = category;
    }

    // Filter berdasarkan status stok
    if (stockStatus === 'safe') {
      query.stock = { $gte: 100 }; // >= 100
    } else if (stockStatus === 'warning') {
      query.stock = { $gte: 50, $lt: 100 }; // 50-99
    } else if (stockStatus === 'danger') {
      query.stock = { $lt: 50 }; // < 50
    }

    const products = await Product.find(query)
      .populate('category', 'name') // Ambil field "name" dari kategori
      .sort({ createdAt: -1 });     // Terbaru dulu

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST buat produk baru (dengan upload gambar)
const createProduct = async (req, res) => {
  try {
    const { name, idItem, category, hargaJual, hargaBeli, stock, tanggalExpired } = req.body;

    // Validasi field wajib
    if (!name || !category || !hargaJual) {
      return res.status(400).json({
        success: false,
        message: 'Nama, kategori, dan harga jual harus diisi',
      });
    }

    // Buat objek produk
    const productData = {
      name, idItem, category,
      hargaJual: Number(hargaJual),
      hargaBeli: Number(hargaBeli) || 0,
      stock: Number(stock) || 0,
      tanggalExpired: tanggalExpired || null,
    };

    // Jika ada file gambar yang diupload
    // multer + cloudinary otomatis upload gambar dan mengisi req.file
    if (req.file) {
      productData.image = req.file.path;           // URL dari Cloudinary
      productData.imagePublicId = req.file.filename; // Public ID untuk hapus nanti
    }

    const product = await Product.create(productData);

    // Populate category sebelum dikirim ke frontend
    await product.populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT update produk
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    const { name, idItem, category, hargaJual, hargaBeli, stock, tanggalExpired } = req.body;

    // Jika ada gambar baru diupload
    if (req.file) {
      // Hapus gambar lama dari Cloudinary (jika ada)
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }
      product.image = req.file.path;
      product.imagePublicId = req.file.filename;
    }

    // Update field lainnya
    product.name = name || product.name;
    product.idItem = idItem || product.idItem;
    product.category = category || product.category;
    product.hargaJual = Number(hargaJual) || product.hargaJual;
    product.hargaBeli = Number(hargaBeli) || product.hargaBeli;
    product.stock = Number(stock) ?? product.stock;
    product.tanggalExpired = tanggalExpired || product.tanggalExpired;

    await product.save();
    await product.populate('category', 'name');

    res.json({ success: true, message: 'Produk berhasil diperbarui', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE hapus produk
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    // Hapus gambar dari Cloudinary jika ada
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT tambah stok
const addStock = async (req, res) => {
  try {
    const { addAmount } = req.body; // Berapa banyak yang ditambahkan

    if (!addAmount || addAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Jumlah tambah stok tidak valid' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { stock: Number(addAmount) } }, // $inc = increment (tambah nilai)
      { new: true }
    ).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    res.json({ success: true, message: `Stok berhasil ditambah ${addAmount}`, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct, addStock };