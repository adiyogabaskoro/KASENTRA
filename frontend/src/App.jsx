// ============================================================
// KASENTRA — App.jsx (VERSI BARU — dengan Protected Routes)
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import LayoutKasir from './components/LayoutKasir';
import LayoutOperator from './components/LayoutOperator';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardKasir from './pages/DashboardKasir';
import TransaksiKasir from './pages/TransaksiKasir';
import MenuKasir from './pages/MenuKasir';
import Setting from './pages/Setting';
import Keuangan from './pages/Keuangan';
import Operator from './pages/Operator';
import StatusToko from './pages/StatusToko';
import Laporan from './pages/Laporan';
import Stock from './pages/Stock';
import Category from './pages/Category';
import { ProtectedRoute } from './hooks/useAuth.jsx'; // ← IMPORT

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Login — publik */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Owner Routes — hanya bisa diakses role 'owner' */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="keuangan" element={<Keuangan />} />
          <Route path="status-toko" element={<StatusToko />} />
          <Route path="operator" element={<Operator />} />
          <Route path="setting" element={<Setting />} />
        </Route>

        {/* Kasir Routes — hanya bisa diakses role 'kasir' */}
        <Route
          path="/kasir"
          element={
            <ProtectedRoute allowedRoles={['kasir']}>
              <LayoutKasir />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardKasir />} />
          <Route path="transaksi-kasir" element={<MenuKasir />} />
          <Route path="transaksi" element={<TransaksiKasir />} />
          <Route path="setting" element={<Setting />} />
        </Route>

        {/* Operator Routes — hanya bisa diakses role 'operator' */}
        <Route
          path="/operator"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <LayoutOperator />
            </ProtectedRoute>
          }
        >
          <Route index element={<Stock />} />
          <Route path="setting" element={<Setting />} />
        </Route>

        {/* Fallback — halaman tidak ditemukan → ke login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
