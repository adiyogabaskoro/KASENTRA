// config/db.js
// ==========================================
// File ini bertugas MENGHUBUNGKAN aplikasi ke MongoDB
// Dijalankan sekali saat server pertama kali nyala
// ==========================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Coba konek ke MongoDB menggunakan URL dari .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // Jika berhasil, tampilkan pesan sukses
    console.log(`✅ MongoDB Terhubung: ${conn.connection.host}`);
    
  } catch (error) {
    // Jika gagal, tampilkan pesan error dan hentikan server
    console.error(`❌ Error koneksi MongoDB: ${error.message}`);
    process.exit(1); // Hentikan aplikasi dengan kode error
  }
};

module.exports = connectDB;