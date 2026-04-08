import styles from './DashboardKasir.module.css';

// Icons matching the design (basket and wallet icons from the screenshot)
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

const transactions = [
  { id: '02839726746', time: '13.45', amount: 25000 },
  { id: '028315287612', time: '13.38', amount: 10000 },
  { id: '02364347237', time: '13.33', amount: 40000 },
  { id: '02839536780', time: '13.20', amount: 15000 },
  { id: '028621168266', time: '13.06', amount: 20000 },
  { id: '02839000067', time: '12.55', amount: 40000 },
  { id: '028736376137', time: '12.39', amount: 30000 },
  { id: '025323723681', time: '12.25', amount: 50000 },
];

const totalPemasukan = transactions.reduce((sum, t) => sum + t.amount, 0);

export default function DashboardKasir() {
  return (
    <div className={styles.dashboardKasirContainer}>
      
      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        
        {/* Produk Terjual */}
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>
            <BasketIcon />
          </div>
          <div className={styles.cardText}>
            <span className={styles.cardValue}>25</span>
            <span className={styles.cardLabel}>Produk Terjual</span>
          </div>
        </div>

        {/* Total Pemasukan */}
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>
            <WalletIcon />
          </div>
          <div className={styles.cardText}>
            <span className={styles.cardValue}>
              + Rp{totalPemasukan.toLocaleString('id-ID')}
            </span>
            <span className={styles.cardLabel}>Total Pemasukan</span>
          </div>
        </div>

      </div>

      {/* Riwayat Transaksi */}
      <div className={styles.historyCard}>
        <h2 className={styles.historyTitle}>Riwayat Transaksi</h2>
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
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.time}</td>
                <td>Rp{t.amount.toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}
