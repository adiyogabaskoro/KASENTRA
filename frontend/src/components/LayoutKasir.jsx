import { Outlet, useLocation } from 'react-router-dom';
import SidebarKasir from './SidebarKasir';
import styles from './Layout.module.css';

export default function LayoutKasir() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/kasir': return 'Dashboard';
      case '/kasir/transaksi-kasir': return 'Kasir';
      case '/kasir/transaksi': return 'Riwayat Transaksi';
      case '/kasir/setting': return 'Setting';
      default: return 'Dashboard';
    }
  };

  return (
    <div className={styles.layout}>
      <SidebarKasir />
      <main className={styles.mainContent}>
        <header className={styles.pageHeaderKasir}>
          <div className={styles.breadcrumbs}>
            <span>Kasentra</span>
            <span>&gt;</span>
            <span>{getPageTitle()}</span>
          </div>

          {/* Shift info - only on dashboard */}
          {location.pathname === '/kasir' && (
            <div className={styles.shiftInfo}>
              <span className={styles.shiftLabel}>Shift 1</span>
              <span className={styles.shiftSep}>&gt;</span>
              <span className={styles.shiftTime}>08.00 - 16.00</span>
            </div>
          )}

          <div className={styles.userInfo}>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className={styles.userName}>Kasir Kasentra</span>
            </div>
            <div className={styles.roleBadgeKasir}>Kasir</div>
          </div>
        </header>

        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
