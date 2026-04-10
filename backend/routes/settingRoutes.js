// routes/settingRoutes.js
const express = require('express');
const router = express.Router();
const { getSetting, updateSetting, updateStoreLogo, toggleStoreStatus } = require('../controllers/settingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.use(protect);

router.get('/', getSetting);
router.put('/', authorize('owner'), updateSetting);
router.put('/logo', authorize('owner'), upload.single('logo'), updateStoreLogo);
router.put('/toggle-status', authorize('owner'), toggleStoreStatus);

module.exports = router;