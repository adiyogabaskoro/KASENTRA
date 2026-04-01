const prisma = require('../../config/database');

const getAll = async (tokoId, { search, kategoriId, status }) => {
  const where = { tokoId };
  if (search)     where.nama = { contains: search, mode: 'insensitive' };
  if (kategoriId) where.kategoriId = kategoriId;
  if (status)     where.status = status;
  return prisma.produk.findMany({ where, include: { kategori: true }, orderBy: { nama: 'asc' } });
};

const getById = async (id, tokoId) => {
  const produk = await prisma.produk.findFirst({ where: { id, tokoId }, include: { kategori: true } });
  if (!produk) throw { status: 404, message: 'Produk tidak ditemukan' };
  return produk;
};

const create = async (tokoId, data) =>
  prisma.produk.create({ data: { ...data, tokoId } });

const update = async (id, tokoId, data) => {
  await getById(id, tokoId);
  return prisma.produk.update({ where: { id }, data });
};

const remove = async (id, tokoId) => {
  await getById(id, tokoId);
  return prisma.produk.update({ where: { id }, data: { status: 'NONAKTIF' } });
};

// Kategori
const getAllKategori = async (tokoId) =>
  prisma.kategoriProduk.findMany({ where: { tokoId } });

const createKategori = async (tokoId, { nama }) =>
  prisma.kategoriProduk.create({ data: { nama, tokoId } });

const deleteKategori = async (id, tokoId) =>
  prisma.kategoriProduk.delete({ where: { id, tokoId } });

module.exports = { getAll, getById, create, update, remove, getAllKategori, createKategori, deleteKategori };