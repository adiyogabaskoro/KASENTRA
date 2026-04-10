// config/cloudinary.js
// Konfigurasi koneksi ke Cloudinary

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Hubungkan ke akun Cloudinary menggunakan credential dari .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Buat "storage engine" - ini menentukan gambar disimpan di mana di Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'kasentra',       // Semua foto masuk folder "kasentra"
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Format yang diizinkan
    transformation: [
      { width: 500, height: 500, crop: 'limit' }, // Resize max 500x500
      { quality: 'auto' }                          // Kompresi otomatis
    ],
  },
});

// Buat middleware upload menggunakan multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksimal 5MB
  },
  fileFilter: (req, file, cb) => {
    // Cek apakah file adalah gambar
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Izinkan
    } else {
      cb(new Error('Hanya file gambar yang diizinkan!'), false); // Tolak
    }
  },
});

module.exports = { cloudinary, upload };