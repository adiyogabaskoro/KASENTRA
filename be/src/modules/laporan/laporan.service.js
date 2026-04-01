const prisma = require('../../config/database');

const dashboard = async (tokoId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [transaksiHariIni, totalProduk, produkStokRendah, sesiAktif] = await Promise.all([
    prisma.transaksiPos.aggregate({
      where: { sesi: { tokoId }, createdAt: { gte: today } },
      _sum: { grandTotal: true },
      _count: { id: true },
    }),
    prisma.produk.count({ where: { tokoId, status: 'AKTIF' } }),
    prisma.produk.count({ where: { tokoId, stok: { lte: prisma.produk.fields.stokMinimal } } }),
    prisma.sesiToko.findFirst({ where: { tokoId, status: 'BUKA' } }),
  ]);

  return {
    pendapatanHariIni: transaksiHariIni._sum.grandTotal || 0,
    jumlahTransaksiHariIni: transaksiHariIni._count.id,
    totalProdukAktif: totalProduk,
    sesiAktif: !!sesiAktif,
  };
};

const laporanPenjualan = async (tokoId, { tanggalDari, tanggalSampai }) => {
  const where = { sesi: { tokoId } };
  if (tanggalDari || tanggalSampai) {
    where.createdAt = {};
    if (tanggalDari)   where.createdAt.gte = new Date(tanggalDari);
    if (tanggalSampai) where.createdAt.lte = new Date(tanggalSampai);
  }

  const [transaksi, agregat] = await Promise.all([
    prisma.transaksiPos.findMany({
      where,
      include: { itemTransaksi: { include: { produk: true } }, user: { select: { nama: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.transaksiPos.aggregate({
      where,
      _sum: { grandTotal: true, subtotal: true, diskon: true, pajak: true },
      _count: { id: true },
    }),
  ]);

  return { ringkasan: agregat._sum, jumlahTransaksi: agregat._count.id, transaksi };
};

const laporanKeuangan = async (tokoId, { tanggalDari, tanggalSampai }) => {
  const where = { tokoId };
  if (tanggalDari || tanggalSampai) {
    where.tanggal = {};
    if (tanggalDari)   where.tanggal.gte = new Date(tanggalDari);
    if (tanggalSampai) where.tanggal.lte = new Date(tanggalSampai);
  }

  const [masuk, keluar, detail] = await Promise.all([
    prisma.transaksiKeuangan.aggregate({ where: { ...where, jenis: 'MASUK' }, _sum: { nominal: true } }),
    prisma.transaksiKeuangan.aggregate({ where: { ...where, jenis: 'KELUAR' }, _sum: { nominal: true } }),
    prisma.transaksiKeuangan.findMany({ where, include: { kategori: true }, orderBy: { tanggal: 'desc' } }),
  ]);

  const totalMasuk  = masuk._sum.nominal || 0;
  const totalKeluar = keluar._sum.nominal || 0;

  return { totalMasuk, totalKeluar, saldo: totalMasuk - totalKeluar, detail };
};

module.exports = { dashboard, laporanPenjualan, laporanKeuangan };