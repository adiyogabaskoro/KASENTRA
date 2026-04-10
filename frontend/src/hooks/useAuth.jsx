// ============================================================
// KASENTRA — src/hooks/useAuth.js
// Hook untuk membaca data user yang sedang login
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Baca dari localStorage saat komponen mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.href = '/';
  };

  const isLoggedIn = !!token;

  return { user, token, isLoggedIn, logout };
}


// ============================================================
// KASENTRA — ProtectedRoute Component
// Cegah user yang belum login mengakses halaman tertentu
// Cara pakai: Bungkus route dengan <ProtectedRoute>
// ============================================================

import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // Belum login sama sekali → redirect ke halaman login
  if (!token || !userStr) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(userStr);

  // Jika allowedRoles diisi, cek apakah role user sesuai
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role tidak sesuai → redirect ke halaman yang tepat
    if (user.role === 'kasir') return <Navigate to="/kasir" replace />;
    if (user.role === 'operator') return <Navigate to="/operator" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
