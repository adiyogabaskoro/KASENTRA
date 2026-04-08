import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
<<<<<<< Updated upstream
=======
import LayoutKasir from './components/LayoutKasir';
import LayoutOperator from './components/LayoutOperator';
>>>>>>> Stashed changes
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Setting from './pages/Setting';
import Keuangan from './pages/Keuangan';
import Operator from './pages/Operator';
import StatusToko from './pages/StatusToko';
import Laporan from './pages/Laporan';
import Stock from './pages/Stock';
import Category from './pages/Category';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        
        {/* Protected Routes (Wrapper inside Layout) */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="keuangan" element={<Keuangan />} />
          <Route path="status-toko" element={<StatusToko />} />
          <Route path="operator" element={<Operator />} />
          <Route path="setting" element={<Setting />} />
        </Route>

<<<<<<< Updated upstream
=======
        {/* Kasir Routes */}
        <Route path="/kasir" element={<LayoutKasir />}>
          <Route index element={<DashboardKasir />} />
          <Route path="transaksi-kasir" element={<MenuKasir />} />
          <Route path="transaksi" element={<TransaksiKasir />} />
          <Route path="setting" element={<Setting />} />
        </Route>

        {/* Operator Routes */}
        <Route path="/operator" element={<LayoutOperator />}>
          <Route index element={<Stock />} />
          <Route path="setting" element={<Setting />} />
        </Route>

>>>>>>> Stashed changes
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
