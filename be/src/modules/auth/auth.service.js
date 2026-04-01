const prisma = require('../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role, tokoId: user.tokoId },
    process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const register = async ({ nama, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw { status: 400, message: 'Email sudah terdaftar' };

  const hashed = await bcrypt.hash(password, 10);

  // Buat toko default sekaligus saat register pertama kali
  const toko = await prisma.toko.create({
    data: { nama: `Toko ${nama}` },
  });

  const user = await prisma.user.create({
    data: { nama, email, password: hashed, role: 'OWNER', tokoId: toko.id },
  });

  return { user: { id: user.id, nama: user.nama, email: user.email, role: user.role }, token: generateToken(user) };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 400, message: 'Email atau password salah' };
  if (!user.status) throw { status: 403, message: 'Akun dinonaktifkan' };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw { status: 400, message: 'Email atau password salah' };

  return { user: { id: user.id, nama: user.nama, email: user.email, role: user.role }, token: generateToken(user) };
};

const getMe = async (userId) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, nama: true, email: true, role: true, status: true, toko: true },
  });

module.exports = { register, login, getMe };