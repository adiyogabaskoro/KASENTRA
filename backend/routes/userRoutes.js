// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, createUser, deleteUser, toggleUserStatus, resetUserPassword } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('owner')); // Hanya owner

router.route('/').get(getUsers).post(createUser);
router.delete('/:id', deleteUser);
router.put('/:id/toggle-status', toggleUserStatus);
router.put('/:id/reset-password', resetUserPassword);

module.exports = router;