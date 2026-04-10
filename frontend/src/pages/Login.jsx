// ============================================================
// KASENTRA — Login.jsx (VERSI BARU — Terhubung ke Backend)
// Perubahan dari versi lama:
//   ❌ Sebelum: hardcoded credentials, cek di frontend
//   ✅ Sekarang: kirim ke API backend, dapat JWT token
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Dropdown from '../components/Dropdown';
import styles from './Login.module.css';
import logo from '../assets/logo.png';
import { authAPI } from '../services/api'; // ← IMPORT API

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');
  const [idUser, setIdUser] = useState('');
  const [password, setPassword] = useState('');

  // State untuk error dari UI
  const [errors, setErrors] = useState({ idUser: '', password: '', role: '' });

  // State baru: loading & error dari API
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validasi sederhana di frontend
    if (!role) {
      setErrors({ ...errors, role: 'Silakan pilih role terlebih dahulu' });
      return;
    }
    if (!idUser) {
      setErrors({ ...errors, idUser: 'ID User wajib diisi' });
      return;
    }
    if (!password) {
      setErrors({ ...errors, password: 'Password wajib diisi' });
      return;
    }

    // Reset error sebelum request
    setErrors({ idUser: '', password: '', role: '' });
    setApiError('');
    setLoading(true);

    try {
      // ✅ Kirim ke backend — bukan cek di frontend lagi!
      const response = await authAPI.login({
        username: idUser,
        password: password,
        role: role,
      });

      const { token, user } = response.data.data;

      // ✅ Simpan token & info user ke localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // ✅ Redirect berdasarkan role dari response backend
      const userRole = user.role;
      if (userRole === 'kasir') {
        navigate('/kasir');
      } else if (userRole === 'operator') {
        navigate('/operator');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      // ✅ Tampilkan error dari backend ke UI
      const message =
        error.response?.data?.message || // pesan dari backend
        'Terjadi kesalahan. Coba lagi.';  // fallback
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftSide}>
        <div className={styles.logo}>
          <img src={logo} alt="Kasentra Logo" />
          <span>Kasentra</span>
        </div>

        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Masuk akun</h1>
          <div className={styles.titleLine}></div>
          <p className={styles.subtitle}>
            Masuk akun Anda untuk memulai proses transaksi dengan mudah dan cepat.
          </p>

          {/* ✅ Tampilkan error dari API di sini */}
          {apiError && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '16px',
              color: '#dc2626',
              fontSize: '14px'
            }}>
              ⚠️ {apiError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Role Dropdown */}
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper} style={{ border: 'none', padding: 0 }}>
                <Dropdown
                  options={[
                    { value: 'kasir', label: 'Kasir' },
                    { value: 'owner', label: 'Owner' },
                    { value: 'operator', label: 'Operator' },
                  ]}
                  value={role}
                  onChange={(val) => {
                    setRole(val);
                    setErrors({ ...errors, role: '' });
                  }}
                  placeholder="Masukkan Sebagai"
                  error={!!errors.role}
                />
              </div>
              {errors.role && <span className={styles.errorText}>{errors.role}</span>}
            </div>

            {/* Username / ID User */}
            <div className={styles.formGroup}>
              <label>ID User</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="Masukkan ID User"
                  value={idUser}
                  onChange={(e) => {
                    setIdUser(e.target.value);
                    setErrors({ ...errors, idUser: '' });
                  }}
                  className={errors.idUser ? styles.inputError : ''}
                  disabled={loading}
                />
              </div>
              {errors.idUser && <span className={styles.errorText}>{errors.idUser}</span>}
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label>Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: '' });
                  }}
                  className={errors.password ? styles.inputError : ''}
                  disabled={loading}
                />
                {showPassword ? (
                  <Eye size={20} className={styles.eyeIcon} onClick={() => setShowPassword(false)} />
                ) : (
                  <EyeOff size={20} className={styles.eyeIcon} onClick={() => setShowPassword(true)} />
                )}
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? '⏳ Masuk...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.rightContent}>
          <h2 className={styles.rightTitle}>Mudah dan Efisien</h2>
          <p className={styles.rightSubtitle}>
            Kelola proses dengan cepat melalui fitur modern yang mempermudah setiap langkah Anda.
          </p>
          <div className={styles.pagination}>
            <div className={`${styles.dot} ${styles.active}`}></div>
            <div className={styles.dot}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
