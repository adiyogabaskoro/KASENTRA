import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import Dropdown from '../components/Dropdown';
import styles from './Login.module.css';
import logo from '../assets/logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');
  const [idUser, setIdUser] = useState('');
  const [password, setPassword] = useState('');
  
  // State for error messages
  const [errors, setErrors] = useState({
    idUser: '',
    password: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Reset errors
    let idError = '';
    let passError = '';
    let roleError = '';

<<<<<<< Updated upstream
    // Role restriction
    if (role !== 'owner') {
      roleError = 'Akses dibatasi, saat ini hanya Role Owner yang tersedia';
=======
    // Credentials per role
    const credentials = {
      owner: { id: 'admin', password: 'password123' },
      kasir: { id: 'kasir', password: 'kasir1234' },
      operator: { id: 'operator', password: 'operator123' },
    };

    // Role validation
    if (!role) {
      roleError = 'Silakan pilih role terlebih dahulu';
>>>>>>> Stashed changes
    }

    // Simple validation simulation (for UI demonstration)
    if (idUser !== 'admin') {
      idError = 'ID User yang Anda masukan tidak terdaftar';
    }

    if (password.length < 8 || password.length > 12) {
      passError = 'Password yang Anda masukan harus sekitar 8-12 Karakter';
    } else if (password !== 'password123') {
      passError = 'Password yang Anda masukan salah';
    }

    if (idError || passError || roleError) {
      setErrors({ 
        idUser: idError, 
        password: passError,
        role: roleError 
      });
      return;
    }

<<<<<<< Updated upstream
    // Success redirect
    navigate('/dashboard');
=======
    // Simpan role ke sessionStorage lalu redirect
    sessionStorage.setItem('userRole', role);
    if (role === 'kasir') {
      navigate('/kasir');
    } else if (role === 'operator') {
      navigate('/operator');
    } else {
      navigate('/dashboard');
    }
>>>>>>> Stashed changes
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

          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper} style={{ border: 'none', padding: 0 }}>
                <Dropdown 
                  options={[
                    { value: 'kasir', label: 'Kasir' },
                    { value: 'owner', label: 'Owner' },
                    { value: 'operator', label: 'Operator' }
                  ]}
                  value={role}
                  onChange={(val) => {
                    setRole(val);
                    setErrors({...errors, role: ''});
                  }}
                  placeholder="Masukkan Sebagai"
                  error={!!errors.role}
                  className="lexend-font"
                />
              </div>
              {errors.role && <span className={styles.errorText}>{errors.role}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>ID User</label>
              <div className={styles.inputWrapper}>
                <input 
                  type="text" 
                  placeholder="Masukkan ID User" 
                  value={idUser}
                  onChange={(e) => {
                    setIdUser(e.target.value);
                    setErrors({...errors, idUser: ''});
                  }}
                  className={errors.idUser ? styles.inputError : ''}
                  required
                />
              </div>
              {errors.idUser && <span className={styles.errorText}>{errors.idUser}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <div className={styles.inputWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Masukkan Password" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({...errors, password: ''});
                  }}
                  className={errors.password ? styles.inputError : ''}
                  required
                />
                {showPassword ? (
                  <Eye 
                    size={20} 
                    className={styles.eyeIcon} 
                    onClick={() => setShowPassword(false)} 
                  />
                ) : (
                  <EyeOff 
                    size={20} 
                    className={styles.eyeIcon} 
                    onClick={() => setShowPassword(true)} 
                  />
                )}
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <button type="submit" className={styles.submitBtn}>
              Masuk
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
