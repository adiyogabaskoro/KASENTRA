// controllers/financeController.js
const Finance = require('../models/Finance');

const getFinances = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    let query = {};

    if (type) query.type = type;
    if (category) query.category = category;

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59)),
      };
    }

    const finances = await Finance.find(query).sort({ date: -1 });

    // Hitung total masuk dan keluar
    const totalMasuk = finances.filter(f => f.type === 'Masuk').reduce((sum, f) => sum + f.amount, 0);
    const totalKeluar = finances.filter(f => f.type === 'Keluar').reduce((sum, f) => sum + f.amount, 0);

    res.json({
      success: true,
      data: finances,
      summary: { totalMasuk, totalKeluar, saldo: totalMasuk - totalKeluar },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFinance = async (req, res) => {
  try {
    const { date, category, type, amount, desc } = req.body;

    if (!category || !type || !amount) {
      return res.status(400).json({ success: false, message: 'Kategori, tipe, dan jumlah harus diisi' });
    }

    const finance = await Finance.create({ date, category, type, amount: Number(amount), desc });
    res.status(201).json({ success: true, message: 'Catatan keuangan berhasil ditambahkan', data: finance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFinance = async (req, res) => {
  try {
    const finance = await Finance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!finance) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });

    res.json({ success: true, message: 'Data berhasil diperbarui', data: finance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFinance = async (req, res) => {
  try {
    const finance = await Finance.findByIdAndDelete(req.params.id);

    if (!finance) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });

    res.json({ success: true, message: 'Data berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFinances, createFinance, updateFinance, deleteFinance };