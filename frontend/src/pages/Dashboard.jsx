import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ShoppingBag, FileText, CreditCard, ArrowDown } from 'lucide-react';
import styles from './Dashboard.module.css';
import { transactionAPI } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function Dashboard() {
  const [stats, setStats] = useState({ produkTerjual: 0, totalPemasukan: 0, totalTransaksi: 0 });
  const [chartData, setChartData] = useState(Array(12).fill(0));
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const storeName = JSON.parse(localStorage.getItem('user') || '{}')?.storeName || 'Toko';

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await transactionAPI.getAll({ limit: 100 });
      const transactions = res.data.data || [];

      // Hitung statistik dari transaksi
      const totalTransaksi = transactions.length;
      const totalPemasukan = transactions.reduce((sum, t) => sum + (t.total || t.totalHarga || 0), 0);
      const produkTerjual = transactions.reduce((sum, t) => {
        return sum + (t.items || t.produk || []).reduce((s, item) => s + (item.qty || item.jumlah || 0), 0);
      }, 0);

      setStats({ produkTerjual, totalPemasukan, totalTransaksi });

      // Buat data chart bulanan (tahun ini)
      const bulanData = Array(12).fill(0);
      transactions.forEach(t => {
        const tgl = new Date(t.createdAt || t.tanggal);
        if (tgl.getFullYear() === new Date().getFullYear()) {
          bulanData[tgl.getMonth()] += (t.total || t.totalHarga || 0);
        }
      });
      setChartData(bulanData);

      // History 8 transaksi terakhir
      setHistory(transactions.slice(0, 8));
    } catch (err) {
      console.error('Error fetch dashboard:', err);
    } finally { setLoading(false); }
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      data: chartData,
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
      tooltip: { callbacks: { label: (ctx) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(ctx.raw) } }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v) => 'Rp ' + Number(v).toLocaleString('id-ID'), stepSize: 1000000 },
        grid: { color: '#F0F0F0' },
        border: { display: false }
      },
      x: { grid: { display: false }, border: { display: false } }
    },
  };

  const formatRp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
  const bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  return (
    <div className={styles.dashboard}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>⏳ Memuat dashboard...</div>
      ) : (
        <>
          <div className={styles.summaryCards}>
            <div className={styles.card}>
              <div className={styles.cardIcon}><ShoppingBag size={28} /><div className={styles.iconBadge}><ArrowDown size={14} /></div></div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>{stats.produkTerjual}</span>
                <span className={styles.cardLabel}>Produk Terjual</span>
                <span className={styles.cardChange}><ArrowDown size={12} /> Total item terjual</span>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}><FileText size={28} /><div className={styles.iconBadge}><ArrowDown size={14} /></div></div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>+ {formatRp(stats.totalPemasukan)}</span>
                <span className={styles.cardLabel}>Total Pemasukan</span>
                <span className={styles.cardChange}><ArrowDown size={12} /> Total semua transaksi</span>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}><CreditCard size={28} /><div className={styles.iconBadge}><ArrowDown size={14} /></div></div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>{stats.totalTransaksi}</span>
                <span className={styles.cardLabel}>Total Transaksi</span>
                <span className={styles.cardChange}><ArrowDown size={12} /> Jumlah transaksi</span>
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
                  <span>Transaksi</span><span>Bulan</span><span style={{ textAlign: 'right' }}>Nominal</span>
                </div>
                {history.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Belum ada transaksi</div>
                ) : history.map((item, i) => {
                  const tgl = new Date(item.createdAt || item.tanggal);
                  return (
                    <div key={item._id || i} className={styles.historyItem}>
                      <span>{storeName}</span>
                      <span className={styles.month}>{bulanNames[tgl.getMonth()]}</span>
                      <span className={styles.nominal}>{formatRp(item.total || item.totalHarga)}</span>
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
