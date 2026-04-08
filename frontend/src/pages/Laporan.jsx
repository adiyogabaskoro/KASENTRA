import { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ShoppingCart, Wallet, TrendingDown, Printer } from 'lucide-react';
import { PeriodeDropdown, DateFilterBtn } from '../components/PeriodFilter';
import styles from './Laporan.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

// ── Data ─────────────────────────────────────────────────────────────────────
const chartLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const chartValues = [3900000,4400000,3900000,3700000,4900000,6800000,5000000,5800000,0,0,0,0];
const historyData = [
  { transaksi:'Tesco Market', bulan:'Januari',  nominal:4000000 },
  { transaksi:'Tesco Market', bulan:'Februari', nominal:4500000 },
  { transaksi:'Tesco Market', bulan:'Maret',    nominal:4000000 },
  { transaksi:'Tesco Market', bulan:'April',    nominal:3800000 },
  { transaksi:'Tesco Market', bulan:'Mei',      nominal:5000000 },
  { transaksi:'Tesco Market', bulan:'Juni',     nominal:7000000 },
  { transaksi:'Tesco Market', bulan:'Juli',     nominal:5000000 },
  { transaksi:'Tesco Market', bulan:'Agustus',  nominal:6000000 },
];
const fmt = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Laporan() {
  const [periode, setPeriode]     = useState('Bulanan');
  const [dateValue, setDateValue] = useState(null);

  const handlePeriodeChange = (p) => { setPeriode(p); setDateValue(null); };

  const chartData = {
    labels: chartLabels,
    datasets: [{ data: chartValues, backgroundColor: '#111827', borderRadius: 4, barPercentage: 0.6 }],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => fmt(ctx.raw) } } },
    scales: {
      y: {
        beginAtZero: true, min: 2000000,
        ticks: { callback: (v) => v===0 ? '' : 'Rp. '+new Intl.NumberFormat('id-ID').format(v), stepSize: 1000000 },
        grid: { color: '#F0F0F0' }, border: { display: false },
      },
      x: { grid: { display: false }, border: { display: false } },
    },
  };

  return (
    <div className={styles.page}>
      {/* Cards */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardIcon}><ShoppingCart size={26}/></div>
          <div className={styles.cardBody}>
            <span className={styles.cardLbl}>Total transaksi</span>
            <span className={styles.cardVal}>50</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}><Wallet size={26}/></div>
          <div className={styles.cardBody}>
            <span className={styles.cardLbl}>Total Penjualan</span>
            <span className={styles.cardVal}>Rp 30.000.000</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}><TrendingDown size={26}/></div>
          <div className={styles.cardBody}>
            <span className={styles.cardLbl}>Total Pengeluaran</span>
            <span className={styles.cardVal}>Rp 1.500.000</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterLeft}>
          <PeriodeDropdown value={periode} onChange={handlePeriodeChange} />
          <DateFilterBtn periode={periode} value={dateValue} onChange={setDateValue} />
        </div>
        <button className={styles.btnCetak}><Printer size={15}/> Cetak Laporan PDF</button>
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Grafik Penjualan Bulanan</h3>
          <div className={styles.chartWrap}><Bar data={chartData} options={chartOptions}/></div>
        </div>
        <div className={styles.historyCard}>
          <h3 className={styles.historyTitle}>Transaction history</h3>
          <div className={styles.historyTable}>
            <div className={styles.historyHeader}>
              <span>Transaksi</span><span>Bulan</span><span>Nominal</span>
            </div>
            {historyData.map((row, i) => (
              <div key={i} className={styles.historyRow}>
                <span>{row.transaksi}</span>
                <span className={styles.bulan}>{row.bulan}</span>
                <span className={styles.nominal}>{fmt(row.nominal)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
