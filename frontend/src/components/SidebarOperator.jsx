import { NavLink } from 'react-router-dom';
import { Package, Settings } from 'lucide-react';
import styles from './Sidebar.module.css';
import logo from '../assets/logo.png';

export default function SidebarOperator() {
  const navItems = [
    { path: '/operator', label: 'Stock & Category', icon: Package },
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
            end={item.path === '/operator'}
          >
            <item.icon size={20} className={styles.navIcon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.bottomNav}>
        <NavLink
          to="/operator/setting"
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
