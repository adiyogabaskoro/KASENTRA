const prisma = require('../../config/database');

const getKategori    = async (tokoId) => prisma.kategoriKeuangan.findMany({ where: { tokoId } });
const createKategori = async (tokoId, data) => prisma.kategoriKeuangan.create({ data: { ...data, tokoId } });
const deleteKategori = async (id, tokoId) => prisma.kategoriKeuangan.delete({ where: { id, tokoId } });

const getAll = async (tokoId, { jenis, tanggalDari, tanggalSampai }) => {
  const where = { tokoId };
  if (jenis) where.jenis = jenis;
  if (tanggalDari || tanggalSampai) {
    where.tanggal = {};
    if (tanggalDari)   where.tanggal.gte = new Date(tanggalDari);
    if (tanggalSampai) where.tanggal.lte = new Date(tanggalSampai);
  }
  return prisma.transaksiKeuangan.findMany({
    where,
    include: { kategori: true, user: { select: { nama: true } } },
    orderBy: { tanggal: 'desc' },
  });
};

const create = async (tokoId, userId, data) =>
  prisma.transaksiKeuangan.create({
    data: { ...data, tokoId, userId },
    include: { kategori: true },
  });

const remove = async (id, tokoId) => prisma.transaksiKeuangan.delete({ where: { id, tokoId } });

module.exports = { getKategori, createKategori, deleteKategori, getAll, create, remove };