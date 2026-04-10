// routes/financeRoutes.js
const express = require('express');
const router = express.Router();
const { getFinances, createFinance, updateFinance, deleteFinance } = require('../controllers/financeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('owner')); // Hanya owner yang bisa akses

router.route('/').get(getFinances).post(createFinance);
router.route('/:id').put(updateFinance).delete(deleteFinance);

module.exports = router;