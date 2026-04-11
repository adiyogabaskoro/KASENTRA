// ============================================================
// KASENTRA — Dashboard.jsx [FIXED v2]
// FIX: Gunakan GET /api/transactions/dashboard-stats yang tersedia
//      Sebelumnya Dashboard menghitung manual dari semua transaksi
//      (tidak efisien & tidak menggunakan endpoint yang sudah dibuat)
// ============================================================

import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ShoppingBag, FileText, CreditCard, TrendingUp } from 'lucide-react';
import styles from './Dashboard.module.css';
import { transactionAPI } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    chartData: [],
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const storeName = JSON.parse(localStorage.getItem('user') || '{}')?.name || 'Toko';

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      // FIX: Pakai endpoint dashboard-stats yang sudah ada di backend
      // Juga ambil history 8 transaksi terbaru
      const [statsRes, historyRes] = await Promise.all([
        transactionAPI.getDashboardStats(),
        transactionAPI.getAll({ limit: 8 }),
      ]);

      setStats(statsRes.data.data || { totalRevenue: 0, totalTransactions: 0, chartData: [] });
      setHistory(historyRes.data.data?.slice(0, 8) || []);
    } catch (err) {
      // Fallback jika dashboard-stats gagal (misal owner belum ada transaksi)
      setError('');
      try {
        const res = await transactionAPI.getAll({ limit: 100 });
        const transactions = res.data.data || [];
        const totalTransactions = transactions.length;
        const totalRevenue = transactions.reduce((s, t) => s + (t.total || 0), 0);
        const bulanData = Array(12).fill(0);
        transactions.forEach(t => {
          const tgl = new Date(t.createdAt);
          if (tgl.getFullYear() === new Date().getFullYear()) {
            bulanData[tgl.getMonth()] += (t.total || 0);
          }
        });
        const chartData = bulanData.map((total, i) => ({
          month: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][i],
          total,
        }));
        setStats({ totalRevenue, totalTransactions, chartData });
        setHistory(transactions.slice(0, 8));
      } catch (e) {
        setError('Gagal memuat dashboard.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Ambil nilai chart dari format backend {month, total}
  const chartValues = stats.chartData?.length
    ? stats.chartData.map(d => d.total || 0)
    : Array(12).fill(0);

  const chartLabels = stats.chartData?.length
    ? stats.chartData.map(d => d.month)
    : ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  const barData = {
    labels: chartLabels,
    datasets: [{
      data: chartValues,
      backgroundColor: '#000000',
      borderRadius: 4,
      barPercentage: 0.6,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR',
          }).format(ctx.raw),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (v) => 'Rp ' + Number(v).toLocaleString('id-ID'),
          stepSize: 1000000,
        },
        grid: { color: '#F0F0F0' },
        border: { display: false },
      },
      x: { grid: { display: false }, border: { display: false } },
    },
  };

  const formatRp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
  const bulanNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

  return (
    <div className={styles.dashboard}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
          ⏳ Memuat dashboard...
        </div>
      ) : error ? (
        <div style={{ background: '#fee2e2', padding: '16px', borderRadius: '8px', color: '#dc2626', marginBottom: '20px' }}>
          ⚠️ {error}
          <button onClick={fetchDashboard} style={{ marginLeft: '8px', textDecoration: 'underline', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
            Coba lagi
          </button>
        </div>
      ) : (
        <>
          <div className={styles.summaryCards}>
            <div className={styles.card}>
              <div className={styles.cardIcon}><ShoppingBag size={28} /></div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>{stats.totalTransactions}</span>
                <span className={styles.cardLabel}>Total Transaksi Bulan Ini</span>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}><FileText size={28} /></div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>{formatRp(stats.totalRevenue)}</span>
                <span className={styles.cardLabel}>Total Pemasukan Bulan Ini</span>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}><TrendingUp size={28} /></div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>{storeName}</span>
                <span className={styles.cardLabel}>Nama Toko</span>
              </div>
            </div>
          </div>

          <div className={styles.mainGrid}>
            <div className={styles.chartSection}>
              <h3 className={styles.sectionTitle}>Grafik Penjualan</h3>
              <div className={styles.chartContainer}>
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>
            <div className={styles.historySection}>
              <h3 className={styles.sectionTitle}>Transaction history</h3>
              <div className={styles.historyList}>
                <div className={styles.historyHeader}>
                  <span>No. Transaksi</span><span>Bulan</span><span style={{ textAlign: 'right' }}>Nominal</span>
                </div>
                {history.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                    Belum ada transaksi
                  </div>
                ) : history.map((item, i) => {
                  const tgl = new Date(item.createdAt);
                  return (
                    <div key={item._id || i} className={styles.historyItem}>
                      <span style={{ fontSize: '12px' }}>{item.noTransaksi || item._id?.slice(-8)}</span>
                      <span className={styles.month}>{bulanNames[tgl.getMonth()]}</span>
                      <span className={styles.nominal}>{formatRp(item.total)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
