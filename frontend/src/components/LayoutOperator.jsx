import { Outlet, useLocation } from 'react-router-dom';
import SidebarOperator from './SidebarOperator';
import styles from './Layout.module.css';

export default function LayoutOperator() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/operator': return 'Stock & Category';
      case '/operator/setting': return 'Setting';
      default: return 'Stock & Category';
    }
  };

  return (
    <div className={styles.layout}>
      <SidebarOperator />
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className={styles.userName}>Operator Kasentra</span>
            </div>
            <div className={styles.roleBadge}>Operator</div>
          </div>
        </header>

        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
