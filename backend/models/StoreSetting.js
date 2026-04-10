// models/StoreSetting.js
// Pengaturan toko (halaman Setting)
// Hanya ada 1 dokumen untuk seluruh aplikasi

const mongoose = require('mongoose');

const storeSettingSchema = new mongoose.Schema(
  {
    // Profil toko
    storeName: { type: String, default: 'Toko Saya' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    email: { type: String, default: '' },

    // Logo toko (URL dari Cloudinary)
    logo: { type: String, default: '' },
    logoPublicId: { type: String, default: '' },

    // Pengaturan pajak
    taxEnabled: { type: Boolean, default: false },
    taxRate: { type: Number, default: 10 }, // Persentase

    // Status toko
    isOpen: { type: Boolean, default: false },
    openTime: { type: String, default: '' },
    closeTime: { type: String, default: '' },

    // Notifikasi
    notifStock: { type: Boolean, default: true },
    notifLaporan: { type: Boolean, default: true },

    // Format struk
    receiptStoreName: { type: String, default: '' },
    receiptAddress: { type: String, default: '' },
    receiptPhone: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const StoreSetting = mongoose.model('StoreSetting', storeSettingSchema);
module.exports = StoreSetting;