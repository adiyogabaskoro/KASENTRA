const prisma = require('../../config/database');

// ---- SESI TOKO ----
const bukaSesi = async (tokoId, userId, { modalAwal }) => {
  const aktif = await prisma.sesiToko.findFirst({ where: { tokoId, status: 'BUKA' } });
  if (aktif) throw { status: 400, message: 'Sesi sudah terbuka' };
  return prisma.sesiToko.create({ data: { tokoId, userId, modalAwal } });
};

const tutupSesi = async (tokoId) => {
  const sesi = await prisma.sesiToko.findFirst({ where: { tokoId, status: 'BUKA' } });
  if (!sesi) throw { status: 400, message: 'Tidak ada sesi aktif' };
  return prisma.sesiToko.update({
    where: { id: sesi.id },
    data: { status: 'TUTUP', waktuTutup: new Date() },
  });
};

const getSesiAktif = async (tokoId) =>
  prisma.sesiToko.findFirst({ where: { tokoId, status: 'BUKA' }, include: { user: { select: { nama: true } } } });

const getRiwayatSesi = async (tokoId) =>
  prisma.sesiToko.findMany({ where: { tokoId }, orderBy: { waktuBuka: 'desc' }, take: 30 });

// ---- TRANSAKSI ----
const buatTransaksi = async (tokoId, userId, { items, diskon = 0, metodeBayar, nominalBayar }) => {
  const sesi = await prisma.sesiToko.findFirst({ where: { tokoId, status: 'BUKA' } });
  if (!sesi) throw { status: 400, message: 'Buka sesi toko terlebih dahulu' };

  const toko = await prisma.toko.findUnique({ where: { id: tokoId } });

  // Hitung subtotal dari items
  let subtotal = 0;
  const itemsData = [];

  for (const item of items) {
    const produk = await prisma.produk.findFirst({ where: { id: item.produkId, tokoId } });
    if (!produk) throw { status: 404, message: `Produk ${item.produkId} tidak ditemukan` };
    if (produk.stok < item.qty) throw { status: 400, message: `Stok ${produk.nama} tidak cukup` };

    const itemSubtotal = produk.hargaJual * item.qty;
    subtotal += itemSubtotal;
    itemsData.push({ produk, qty: item.qty, hargaSatuan: produk.hargaJual, subtotal: itemSubtotal });
  }

  const pajak = subtotal * (toko.pajakPersen / 100);
  const grandTotal = subtotal - diskon + pajak;
  const kembalian = nominalBayar - grandTotal;

  if (kembalian < 0) throw { status: 400, message: 'Nominal bayar kurang' };

  // Buat transaksi + update stok dalam satu transaction DB
  const result = await prisma.$transaction(async (tx) => {
    const trx = await tx.transaksiPos.create({
      data: {
        sesiId: sesi.id, userId, subtotal, diskon, pajak, grandTotal, metodeBayar, nominalBayar, kembalian,
        itemTransaksi: {
          create: itemsData.map((i) => ({
            produkId: i.produk.id, qty: i.qty, hargaSatuan: i.hargaSatuan, subtotal: i.subtotal,
          })),
        },
      },
      include: { itemTransaksi: { include: { produk: true } } },
    });

    // Update stok & buat mutasi
    for (const i of itemsData) {
      const stokBaru = i.produk.stok - i.qty;
      await tx.produk.update({ where: { id: i.produk.id }, data: { stok: stokBaru } });
      await tx.mutasiStok.create({
        data: {
          produkId: i.produk.id, userId, jenis: 'KELUAR', jumlah: i.qty,
          stokSebelum: i.produk.stok, stokSesudah: stokBaru, keterangan: `Transaksi POS #${trx.id}`,
        },
      });
    }

    // Update total di sesi
    await tx.sesiToko.update({
      where: { id: sesi.id },
      data: {
        totalTransaksi: { increment: 1 },
        totalPendapatan: { increment: grandTotal },
      },
    });

    return trx;
  });

  return result;
};

const getTransaksi = async (tokoId, { sesiId, tanggalDari, tanggalSampai }) => {
  const where = { sesi: { tokoId } };
  if (sesiId) where.sesiId = sesiId;
  if (tanggalDari || tanggalSampai) {
    where.createdAt = {};
    if (tanggalDari)   where.createdAt.gte = new Date(tanggalDari);
    if (tanggalSampai) where.createdAt.lte = new Date(tanggalSampai);
  }
  return prisma.transaksiPos.findMany({
    where,
    include: { itemTransaksi: { include: { produk: true } }, user: { select: { nama: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

const getTransaksiById = async (id, tokoId) => {
  const trx = await prisma.transaksiPos.findFirst({
    where: { id, sesi: { tokoId } },
    include: { itemTransaksi: { include: { produk: true } }, user: { select: { nama: true } }, sesi: true },
  });
  if (!trx) throw { status: 404, message: 'Transaksi tidak ditemukan' };
  return trx;
};

module.exports = { bukaSesi, tutupSesi, getSesiAktif, getRiwayatSesi, buatTransaksi, getTransaksi, getTransaksiById };