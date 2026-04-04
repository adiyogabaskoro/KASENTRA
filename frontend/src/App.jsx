import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import LayoutKasir from './components/LayoutKasir';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardKasir from './pages/DashboardKasir';
import TransaksiKasir from './pages/TransaksiKasir';
import Setting from './pages/Setting';
import Keuangan from './pages/Keuangan';
import Operator from './pages/Operator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        
        {/* Owner Routes */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="laporan" element={<div>Halaman Laporan (WIP)</div>} />
          <Route path="keuangan" element={<Keuangan />} />
          <Route path="status-toko" element={<div>Halaman Status Toko (WIP)</div>} />
          <Route path="operator" element={<Operator />} />
          <Route path="setting" element={<Setting />} />
        </Route>

        {/* Kasir Routes */}
        <Route path="/kasir" element={<LayoutKasir />}>
          <Route index element={<DashboardKasir />} />
          <Route path="transaksi-kasir" element={<div>Halaman Kasir (WIP)</div>} />
          <Route path="transaksi" element={<TransaksiKasir />} />
          <Route path="setting" element={<Setting />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
