// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
  getCategories, createCategory, updateCategory, deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Semua route di bawah butuh login
router.use(protect);

router.route('/')
  .get(getCategories)                       // GET semua kategori
  .post(authorize('owner'), createCategory); // POST buat kategori baru (owner saja)

router.route('/:id')
  .put(authorize('owner'), updateCategory)   // PUT edit kategori
  .delete(authorize('owner'), deleteCategory); // DELETE hapus kategori

module.exports = router;