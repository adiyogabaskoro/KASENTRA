import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BarChart2, 
  Wallet, 
  Store, 
  Users, 
  Settings 
} from 'lucide-react';
import styles from './Sidebar.module.css';
import logo from '../assets/logo.png';

export default function Sidebar() {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/dashboard/laporan', label: 'Laporan Penjualan', icon: BarChart2 },
    { path: '/dashboard/keuangan', label: 'Keuangan', icon: Wallet },
    { path: '/dashboard/status-toko', label: 'Status toko', icon: Store },
    { path: '/dashboard/operator', label: 'Operator', icon: Users },
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
            end={item.path === '/dashboard'}
          >
            <item.icon size={20} className={styles.navIcon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.bottomNav}>
        <NavLink
          to="/dashboard/setting"
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
