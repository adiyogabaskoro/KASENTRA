import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart, FileText, Settings } from 'lucide-react';
import styles from './Sidebar.module.css';
import logo from '../assets/logo.png';

export default function SidebarKasir() {
  const navItems = [
    { path: '/kasir', label: 'Dashboard', icon: Home },
    { path: '/kasir/transaksi-kasir', label: 'Kasir', icon: ShoppingCart },
    { path: '/kasir/transaksi', label: 'Transaksi', icon: FileText },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={logo} alt="Kasentra Logo" />
        <span>Kasentra</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
            end={item.path === '/kasir'}
          >
            <item.icon size={20} className={styles.navIcon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.bottomNav}>
        <NavLink
          to="/kasir/setting"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <Settings size={20} className={styles.navIcon} />
          <span>Setting</span>
        </NavLink>
      </div>
    </div>
  );
}
