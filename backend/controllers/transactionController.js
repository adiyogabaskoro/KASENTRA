// controllers/transactionController.js
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const Finance = require('../models/Finance');

// POST buat transaksi baru (kasir checkout)
const createTransaction = async (req, res) => {
  const { items, paymentMethod, bayar, diskon, pajak } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Tidak ada item dalam transaksi' });
  }

  try {
    // Hitung total dan validasi stok untuk setiap item
    let subTotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ success: false, message: `Produk ${item.productId} tidak ditemukan` });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Stok ${product.name} tidak cukup (tersisa ${product.stock})`,
        });
      }

      const subtotal = product.hargaJual * item.qty;
      subTotal += subtotal;

      processedItems.push({
        product: product._id,
        productName: product.name,
        hargaJual: product.hargaJual,
        qty: item.qty,
        subtotal,
      });
    }

    const totalPajak = pajak || 0;
    const totalDiskon = diskon || 0;
    const total = subTotal - totalDiskon + totalPajak;

    const kembalian = paymentMethod === 'tunai' ? (Number(bayar) - total) : 0;

    // Buat transaksi
    const transaction = await Transaction.create({
      kasir: req.user._id,
      kasirName: req.user.name,
      items: processedItems,
      subTotal,
      diskon: totalDiskon,
      pajak: totalPajak,
      total,
      paymentMethod,
      bayar: Number(bayar) || total,
      kembalian: Math.max(0, kembalian),
    });

    // Kurangi stok semua produk yang dibeli
    for (const item of processedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.qty } } // $inc dengan nilai negatif = kurangi
      );
    }

    // Otomatis catat ke keuangan sebagai "Penjualan Masuk"
    await Finance.create({
      date: new Date(),
      category: 'Penjualan',
      type: 'Masuk',
      amount: total,
      desc: `Transaksi Kasir - ${transaction.noTransaksi}`,
    });

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil',
      data: transaction,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET semua transaksi
const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, kasir } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59)),
      };
    }

    if (kasir) query.kasir = kasir;

    const transactions = await Transaction.find(query)
      .populate('kasir', 'name username')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET satu transaksi
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('kasir', 'name username');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET statistik untuk Dashboard Owner
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Hitung total penjualan bulan ini
    const monthlyTransactions = await Transaction.find({
      createdAt: { $gte: startOfMonth },
      status: 'selesai',
    });

    const totalRevenue = monthlyTransactions.reduce((sum, t) => sum + t.total, 0);
    const totalTransactions = monthlyTransactions.length;

    // Data chart bulanan (12 bulan terakhir)
    const chartData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const endDate = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

      const monthData = await Transaction.aggregate([
        { $match: { createdAt: { $gte: date, $lte: endDate }, status: 'selesai' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]);

      chartData.push({
        month: date.toLocaleString('id-ID', { month: 'short' }),
        total: monthData[0]?.total || 0,
      });
    }

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalTransactions,
        chartData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createTransaction, getTransactions, getTransactionById, getDashboardStats };