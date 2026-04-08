import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ShoppingBag, FileText, CreditCard, ArrowDown } from 'lucide-react';
import styles from './Dashboard.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip
);

export default function Dashboard() {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [3900000, 4400000, 3900000, 3700000, 4900000, 6800000, 5000000, 5800000, 4500000, 4000000, 3700000, 300000],
        backgroundColor: '#000000',
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(context.raw);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return 'Rp ' + value.toLocaleString('id-ID');
          },
          stepSize: 1000000,
        },
        grid: {
          color: '#F0F0F0',
        },
        border: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        }
      }
    },
  };

  const historyData = [
    { id: 1, trans: 'Tesco Market', month: 'Januari', nominal: 4000000 },
    { id: 2, trans: 'Tesco Market', month: 'Februari', nominal: 4500000 },
    { id: 3, trans: 'Tesco Market', month: 'Maret', nominal: 4000000 },
    { id: 4, trans: 'Tesco Market', month: 'April', nominal: 3800000 },
    { id: 5, trans: 'Tesco Market', month: 'Mei', nominal: 5000000 },
    { id: 6, trans: 'Tesco Market', month: 'Juni', nominal: 7000000 },
    { id: 7, trans: 'Tesco Market', month: 'Juli', nominal: 5000000 },
    { id: 8, trans: 'Tesco Market', month: 'Agustus', nominal: 6000000 },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <ShoppingBag size={28} />
            <div className={styles.iconBadge}><ArrowDown size={14} /></div>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>65</span>
            <span className={styles.cardLabel}>Produk Terjual</span>
            <span className={styles.cardChange}><ArrowDown size={12} /> 25% (30 days)</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <FileText size={28} />
            <div className={styles.iconBadge}><ArrowDown size={14} /></div>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>+ Rp.900.000</span>
            <span className={styles.cardLabel}>Total Pemasukan</span>
            <span className={styles.cardChange}><ArrowDown size={12} /> 25% (30 days)</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <CreditCard size={28} />
            <div className={styles.iconBadge}><ArrowDown size={14} /></div>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>65</span>
            <span className={styles.cardLabel}>Total Transaksi</span>
            <span className={styles.cardChange}><ArrowDown size={12} /> 25% (30 days)</span>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.chartSection}>
          <h3 className={styles.sectionTitle}>Grafik Penjualan</h3>
          <div className={styles.chartContainer}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className={styles.historySection}>
          <h3 className={styles.sectionTitle}>Transaction history</h3>
          <div className={styles.historyList}>
            <div className={styles.historyHeader}>
              <span>Transaksi</span>
              <span>Bulan</span>
              <span style={{ textAlign: 'right' }}>Nominal</span>
            </div>
            {historyData.map((item) => (
              <div key={item.id} className={styles.historyItem}>
                <span>{item.trans}</span>
                <span className={styles.month}>{item.month}</span>
                <span className={styles.nominal}>
                  Rp {item.nominal.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
