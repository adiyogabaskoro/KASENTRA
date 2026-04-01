const prisma = require('../../config/database');
const bcrypt = require('bcryptjs');

const getAll = async (tokoId) =>
  prisma.user.findMany({
    where: { tokoId },
    select: { id: true, nama: true, email: true, role: true, status: true, createdAt: true },
  });

const create = async (tokoId, { nama, email, password, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw { status: 400, message: 'Email sudah dipakai' };
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { nama, email, password: hashed, role: role || 'OPERATOR', tokoId },
    select: { id: true, nama: true, email: true, role: true, status: true },
  });
};

const update = async (id, tokoId, data) => {
  if (data.password) data.password = await bcrypt.hash(data.password, 10);
  return prisma.user.update({
    where: { id, tokoId },
    data,
    select: { id: true, nama: true, email: true, role: true, status: true },
  });
};

const remove = async (id, tokoId) =>
  prisma.user.update({ where: { id, tokoId }, data: { status: false } });

module.exports = { getAll, create, update, remove };