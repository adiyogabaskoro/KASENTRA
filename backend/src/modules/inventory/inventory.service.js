const prisma = require('../../config/database');

const getMutasi = async (tokoId, { produkId, jenis }) => {
  const where = { produk: { tokoId } };
  if (produkId) where.produkId = produkId;
  if (jenis)    where.jenis = jenis;
  return prisma.mutasiStok.findMany({
    where,
    include: { produk: true, user: { select: { nama: true } } },
    orderBy: { tanggal: 'desc' },
  });
};

const tambahStok = async (tokoId, userId, { produkId, jumlah, jenis, keterangan }) => {
  const produk = await prisma.produk.findFirst({ where: { id: produkId, tokoId } });
  if (!produk) throw { status: 404, message: 'Produk tidak ditemukan' };

  const stokSebelum = produk.stok;
  const stokSesudah = jenis === 'MASUK'
    ? stokSebelum + jumlah
    : jenis === 'KELUAR'
    ? stokSebelum - jumlah
    : jumlah; // PENYESUAIAN langsung set

  if (stokSesudah < 0) throw { status: 400, message: 'Stok tidak cukup' };

  const [mutasi] = await prisma.$transaction([
    prisma.mutasiStok.create({
      data: { produkId, userId, jenis, jumlah, stokSebelum, stokSesudah, keterangan },
    }),
    prisma.produk.update({
      where: { id: produkId },
      data: { stok: stokSesudah },
    }),
  ]);

  return mutasi;
};

module.exports = { getMutasi, tambahStok };