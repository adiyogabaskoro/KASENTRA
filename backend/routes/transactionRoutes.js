// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTransaction, getTransactions, getTransactionById, getDashboardStats
} = require('../controllers/transactionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dashboard-stats', authorize('owner'), getDashboardStats);
router.route('/')
  .get(authorize('owner', 'kasir'), getTransactions)
  .post(authorize('kasir'), createTransaction);

router.get('/:id', getTransactionById);

module.exports = router;