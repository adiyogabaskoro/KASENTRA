// ============================================================
// KASENTRA — DashboardKasir.jsx (VERSI BARU — Terhubung ke Backend)
//
// Perubahan dari versi lama:
//   ❌ Sebelum: data dummy hardcoded (25 produk, Rp230.000)
//   ✅ Sekarang: fetch transaksi kasir hari ini dari API
// ============================================================

import { useState, useEffect } from 'react';
import styles from './DashboardKasir.module.css';
import { transactionAPI } from '../services/api';

function BasketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#7B7B8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#7B7B8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <circle cx="17" cy="12" r="2" fill="#F5C842" stroke="#F5C842"/>
      <path d="M1 10h22"/>
    </svg>
  );
}

const formatRp = (n) => '+ Rp' + Number(n || 0).toLocaleString('id-ID');
const formatWaktu = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

export default function DashboardKasir() {
  const [transactions, setTransactions] = useState([]);
  const [produkTerjual, setProdukTerjual] = useState(0);
  const [totalPemasukan, setTotalPemasukan] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Filter transaksi milik kasir ini saja
      const params = { kasir: user._id || user.id };
      const res = await transactionAPI.getAll(params);
      const all = res.data.data || [];

      // Ambil transaksi hari ini saja
      const today = new Date().toDateString();
      const todayTx = all.filter(t => new Date(t.createdAt).toDateString() === today);

      // Hitung statistik
      const pemasukan = todayTx.reduce((sum, t) => sum + (t.total || 0), 0);
      const terjual = todayTx.reduce((sum, t) =>
        sum + (t.items || []).reduce((s, i) => s + (i.qty || 0), 0), 0
      );

      setTransactions(todayTx.slice(0, 10)); // tampilkan 10 terakhir
      setTotalPemasukan(pemasukan);
      setProdukTerjual(terjual);
    } catch (err) {
      console.error('Gagal load dashboard kasir:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboardKasirContainer}>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}><BasketIcon /></div>
          <div className={styles.cardText}>
            <span className={styles.cardValue}>
              {loading ? '...' : produkTerjual}
            </span>
            <span className={styles.cardLabel}>Produk Terjual Hari Ini</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}><WalletIcon /></div>
          <div className={styles.cardText}>
            <span className={styles.cardValue}>
              {loading ? '...' : formatRp(totalPemasukan)}
            </span>
            <span className={styles.cardLabel}>Total Pemasukan Hari Ini</span>
          </div>
        </div>

      </div>

      {/* Riwayat Transaksi */}
      <div className={styles.historyCard}>
        <h2 className={styles.historyTitle}>Riwayat Transaksi Hari Ini</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
            ⏳ Memuat data...
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
            Belum ada transaksi hari ini
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID Order</th>
                <th>Jam</th>
                <th>Nominal</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td>{t.noTransaksi || t._id?.slice(-10)}</td>
                  <td>{formatWaktu(t.createdAt)}</td>
                  <td>Rp{Number(t.total || 0).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
