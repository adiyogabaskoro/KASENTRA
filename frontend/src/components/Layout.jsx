import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';

export default function Layout() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/dashboard/laporan': return 'Laporan Penjualan';
      case '/dashboard/keuangan': return 'Keuangan';
      case '/dashboard/status-toko': return 'Status toko';
      case '/dashboard/operator': return 'Operator';
      case '/dashboard/setting': return 'Setting';
      default: return 'Dashboard';
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.pageHeader}>
          <div className={styles.breadcrumbs}>
            <span>Kasentra</span>
            <span>&gt;</span>
            <span>{getPageTitle()}</span>
          </div>
          
          <div className={styles.userInfo}>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>
                {/* Dummy avatar icon or image */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <span className={styles.userName}>Owner Kasentra</span>
            </div>
            <div className={styles.roleBadge}>Owner</div>
          </div>
        </header>

        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
