// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProducts, createProduct, updateProduct, deleteProduct, addStock
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.use(protect); // Semua route butuh login

router.route('/')
  .get(getProducts)    // GET semua produk (semua role)
  .post(
    authorize('owner', 'operator'),
    upload.single('image'), // Upload 1 file dengan nama field "image"
    createProduct
  );

router.route('/:id')
  .put(
    authorize('owner', 'operator'),
    upload.single('image'),
    updateProduct
  )
  .delete(authorize('owner', 'operator'), deleteProduct);

// Route khusus tambah stok
router.put('/:id/add-stock', authorize('owner', 'operator'), addStock);

module.exports = router;