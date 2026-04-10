// middleware/errorMiddleware.js
// Tangkap semua error dan kirim response yang rapi

const errorHandler = (err, req, res, next) => {
  // Gunakan status code dari error, atau default 500
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan pada server';

  // Error khusus Mongoose: ID tidak valid
  if (err.name === 'CastError') {
    message = `Data dengan ID tersebut tidak ditemukan`;
    statusCode = 404;
  }

  // Error Mongoose: Data duplikat (misal username sudah ada)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} sudah terdaftar, gunakan yang lain`;
    statusCode = 400;
  }

  // Error Mongoose: Validasi gagal
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    message = messages.join(', ');
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Tampilkan stack trace hanya di development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { errorHandler, asyncHandler };