// controllers/settingController.js
const StoreSetting = require('../models/StoreSetting');
const { cloudinary } = require('../config/cloudinary');

// Ambil setting (atau buat default jika belum ada)
const getSetting = async (req, res) => {
  try {
    let setting = await StoreSetting.findOne();

    // Jika belum ada setting, buat default
    if (!setting) {
      setting = await StoreSetting.create({});
    }

    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSetting = async (req, res) => {
  try {
    let setting = await StoreSetting.findOne();

    if (!setting) {
      setting = await StoreSetting.create(req.body);
    } else {
      setting = await StoreSetting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    }

    res.json({ success: true, message: 'Setting berhasil disimpan', data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStoreLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diupload' });
    }

    let setting = await StoreSetting.findOne();

    // Hapus logo lama dari Cloudinary
    if (setting && setting.logoPublicId) {
      await cloudinary.uploader.destroy(setting.logoPublicId);
    }

    setting = await StoreSetting.findOneAndUpdate(
      {},
      { logo: req.file.path, logoPublicId: req.file.filename },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: 'Logo berhasil diupload', data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleStoreStatus = async (req, res) => {
  try {
    let setting = await StoreSetting.findOne();

    if (!setting) setting = await StoreSetting.create({});

    setting.isOpen = !setting.isOpen;
    if (setting.isOpen) {
      setting.openTime = new Date().toISOString();
    } else {
      setting.closeTime = new Date().toISOString();
    }

    await setting.save();

    res.json({
      success: true,
      message: `Toko ${setting.isOpen ? 'dibuka' : 'ditutup'}`,
      data: setting,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSetting, updateSetting, updateStoreLogo, toggleStoreStatus };