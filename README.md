# 🏪 KASENTRA POS - Point of Sale System

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-18%2B-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![React](https://img.shields.io/badge/React-18.2-blue)

> **Sistem Point of Sale (POS) modern untuk toko retail, cafe, dan restoran.**  
> Dibangun dengan **MERN Stack** (MongoDB, Express, React, Node.js) + Cloudinary untuk manajemen gambar.

🔗 **Live Demo:** [https://kasentra-frontend.vercel.app](https://kasentra-frontend.vercel.app) (ganti dengan URL-mu)  
🔗 **API Endpoint:** [https://kasentra-backend.onrender.com](https://kasentra-backend.onrender.com) (ganti dengan URL-mu)

---

## 📸 Screenshot

| Halaman Login | Dashboard Owner | Manajemen Stok | Kasir POS |
|--------------|----------------|----------------|-----------|
| (Tambahkan screenshot nanti) | (Tambahkan screenshot nanti) | (Tambahkan screenshot nanti) | (Tambahkan screenshot nanti) |

---

## ✨ Fitur Utama

### 👑 Owner
- Dashboard statistik penjualan (revenue, transaksi, chart bulanan)
- Manajemen produk (CRUD + upload gambar ke Cloudinary)
- Manajemen kategori produk
- Manajemen akun kasir & operator (buat, hapus, reset password, aktif/nonaktif)
- Laporan keuangan (catatan masuk/keluar manual)
- Pengaturan toko (nama, alamat, logo, pajak, buka/tutup toko)

### 💳 Kasir
- Tampilan POS dengan grid produk
- Keranjang belanja real-time
- Checkout dengan perhitungan otomatis (subtotal, pajak, diskon)
- Cetak struk (format siap print)
- Stok otomatis berkurang setelah transaksi

### 🛠️ Operator
- Manajemen stok produk (tambah, edit, hapus, tambah stok)
- Manajemen kategori
- Lihat laporan transaksi

---

## 🛠️ Teknologi yang Digunakan

### Backend
| Teknologi | Fungsi |
|-----------|--------|
| Node.js | Runtime JavaScript |
| Express.js | Framework web untuk API |
| MongoDB Atlas | Database cloud |
| Mongoose | ODM untuk MongoDB |
| JWT | Autentikasi (JSON Web Token) |
| Bcryptjs | Enkripsi password |
| Cloudinary | Hosting gambar produk & logo |
| Multer | Upload file |

### Frontend
| Teknologi | Fungsi |
|-----------|--------|
| React.js | UI Library |
| Vite | Build tool |
| Axios | HTTP client untuk panggil API |
| React Router DOM | Routing halaman |
| CSS Modules | Styling komponen |

### Deployment
| Platform | Untuk |
|----------|-------|
| Render | Backend API |
| Vercel | Frontend website |
| MongoDB Atlas | Database |
| Cloudinary | Gambar |

---

## 📋 Prasyarat (Sebelum Install)

Pastikan kamu sudah punya:

- [ ] Node.js (versi 18 atau lebih baru)
- [ ] npm atau yarn
- [ ] Akun MongoDB Atlas (gratis)
- [ ] Akun Cloudinary (gratis)
- [ ] Git (opsional, untuk clone repository)

---

## 🚀 Cara Install & Jalankan (Local Development)

### 1. Clone Repository

```bash
git clone https://github.com/username/kasentra-pos.git
cd kasentra-pos