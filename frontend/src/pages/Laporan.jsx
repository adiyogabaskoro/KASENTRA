// ============================================================
// KASENTRA — Laporan.jsx (VERSI BARU — Terhubung ke Backend)
//
// Perubahan dari versi lama:
//   ❌ Sebelum: semua data dummy hardcoded (chart, cards, history)
//   ✅ Sekarang: fetch data transaksi & keuangan real dari API
// ============================================================

import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ShoppingCart, Wallet, TrendingDown, Printer } from 'lucide-react';
import { PeriodeDropdown, DateFilterBtn } from '../components/PeriodFilter';
import styles from './Laporan.module.css';
import { transactionAPI, financeAPI } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const BULAN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const BULAN_FULL = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const fmt = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n || 0);

export default function Laporan() {
  const [periode, setPeriode]         = useState('Bulanan');
  const [dateValue, setDateValue]     = useState(null);
  const [loading, setLoading]         = useState(true);

  // Stats cards
  const [totalTransaksi, setTotalTransaksi]     = useState(0);
  const [totalPenjualan, setTotalPenjualan]     = useState(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);

  // Chart data — penjualan per bulan tahun ini
  const [chartValues, setChartValues] = useState(Array(12).fill(0));

  // History — transaksi terbaru
  const [history, setHistory] = useState([]);

  const handlePeriodeChange = (p) => { setPeriode(p); setDateValue(null); };

  // ============================================================
  // FETCH DATA saat komponen mount atau filter berubah
  // ============================================================
  useEffect(() => {
    fetchLaporan();
  }, [periode, dateValue]);

  const fetchLaporan = async () => {
    try {
      setLoading(true);

      // Tentukan rentang tanggal berdasarkan filter
      const params = buildDateParams(periode, dateValue);

      // Fetch transaksi dan keuangan secara paralel
      const [txRes, finRes] = await Promise.all([
        transactionAPI.getAll({ ...params, limit: 500 }),
        financeAPI.getAll(params),
      ]);

      const transactions = txRes.data.data || [];
      const finances     = finRes.data.data || [];

      // ── Hitung stats cards ────────────────────────────────
      const jmlTransaksi = transactions.length;
      const jmlPenjualan = transactions.reduce((s, t) => s + (t.total || 0), 0);

      // Pengeluaran = finance entries bertipe 'Keluar'
      const jmlPengeluaran = finances
        .filter(f => (f.type || f.tipe || '').toLowerCase() === 'keluar')
        .reduce((s, f) => s + (f.amount || f.nominal || 0), 0);

      setTotalTransaksi(jmlTransaksi);
      setTotalPenjualan(jmlPenjualan);
      setTotalPengeluaran(jmlPengeluaran);

      // ── Buat data chart bulanan (tahun ini) ───────────────
      const tahunIni = new Date().getFullYear();
      const perBulan = Array(12).fill(0);
      transactions.forEach(t => {
        const tgl = new Date(t.createdAt);
        if (tgl.getFullYear() === tahunIni) {
          perBulan[tgl.getMonth()] += (t.total || 0);
        }
      });
      setChartValues(perBulan);

      // ── History — 8 transaksi terbaru ─────────────────────
      setHistory(transactions.slice(0, 8));

    } catch (err) {
      console.error('Gagal load laporan:', err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Chart config
  // ============================================================
  const chartData = {
    labels: BULAN,
    datasets: [{
      data: chartValues,
      backgroundColor: '#111827',
      borderRadius: 4,
      barPercentage: 0.6,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => fmt(ctx.raw) } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (v) => v === 0 ? 'Rp 0' : 'Rp ' + new Intl.NumberFormat('id-ID').format(v),
          stepSize: 1000000,
        },
        grid: { color: '#F0F0F0' },
        border: { display: false },
      },
      x: { grid: { display: false }, border: { display: false } },
    },
  };

  return (
    <div className={styles.page}>

      {/* ── Summary Cards ── */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardIcon}><ShoppingCart size={26}/></div>
          <div className={styles.cardBody}>
            <span className={styles.cardLbl}>Total Transaksi</span>
            <span className={styles.cardVal}>
              {loading ? '...' : totalTransaksi}
            </span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}><Wallet size={26}/></div>
          <div className={styles.cardBody}>
            <span className={styles.cardLbl}>Total Penjualan</span>
            <span className={styles.cardVal}>
              {loading ? '...' : fmt(totalPenjualan)}
            </span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}><TrendingDown size={26}/></div>
          <div className={styles.cardBody}>
            <span className={styles.cardLbl}>Total Pengeluaran</span>
            <span className={styles.cardVal}>
              {loading ? '...' : fmt(totalPengeluaran)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className={styles.filterBar}>
        <div className={styles.filterLeft}>
          <PeriodeDropdown value={periode} onChange={handlePeriodeChange} />
          <DateFilterBtn periode={periode} value={dateValue} onChange={setDateValue} />
        </div>
        <button className={styles.btnCetak} onClick={() => window.print()}>
          <Printer size={15}/> Cetak Laporan PDF
        </button>
      </div>

      {/* ── Main Grid ── */}
      <div className={styles.mainGrid}>

        {/* Chart Penjualan Bulanan */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Grafik Penjualan Bulanan ({new Date().getFullYear()})</h3>
          <div className={styles.chartWrap}>
            <Bar data={chartData} options={chartOptions}/>
          </div>
        </div>

        {/* Transaction History */}
        <div className={styles.historyCard}>
          <h3 className={styles.historyTitle}>Transaksi Terbaru</h3>
          <div className={styles.historyTable}>
            <div className={styles.historyHeader}>
              <span>No. Transaksi</span>
              <span>Tanggal</span>
              <span>Nominal</span>
            </div>

            {loading ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
                ⏳ Memuat...
              </div>
            ) : history.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
                Belum ada transaksi
              </div>
            ) : (
              history.map((tx, i) => {
                const tgl = new Date(tx.createdAt);
                return (
                  <div key={tx._id || i} className={styles.historyRow}>
                    <span>{tx.noTransaksi || tx._id?.slice(-8)}</span>
                    <span className={styles.bulan}>
                      {BULAN_FULL[tgl.getMonth()]}
                    </span>
                    <span className={styles.nominal}>{fmt(tx.total)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================================
// HELPER — Bangun parameter tanggal berdasarkan filter
// ============================================================
function buildDateParams(periode, dateValue) {
  if (!dateValue) {
    // Default: tahun berjalan
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1); // 1 Jan
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
    };
  }

  if (periode === 'Harian') {
    const d = typeof dateValue === 'string' ? dateValue : dateValue.toISOString().split('T')[0];
    return { startDate: d, endDate: d };
  }

  if (periode === 'Mingguan') {
    // dateValue bisa berupa { start, end } dari PeriodFilter
    const s = dateValue.start || dateValue;
    const e = dateValue.end   || dateValue;
    return {
      startDate: typeof s === 'string' ? s : s.toISOString().split('T')[0],
      endDate:   typeof e === 'string' ? e : e.toISOString().split('T')[0],
    };
  }

  if (periode === 'Bulanan') {
    // dateValue bisa berupa { year, month } atau string 'YYYY-MM'
    if (dateValue.year !== undefined) {
      const start = new Date(dateValue.year, dateValue.month, 1);
      const end   = new Date(dateValue.year, dateValue.month + 1, 0);
      return {
        startDate: start.toISOString().split('T')[0],
        endDate:   end.toISOString().split('T')[0],
      };
    }
  }

  // Fallback — tidak filter tanggal
  return {};
}
