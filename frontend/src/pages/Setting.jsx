// ============================================================
// KASENTRA — Setting.jsx [FIXED v2]
// FIX 1: Change password kini pakai PUT /api/auth/change-password (benar)
// FIX 2: Logo upload kini pakai PUT /api/settings/logo (benar)
// FIX 3: Update profil (teks saja) tidak menyertakan file
// ============================================================

import { useState, useEffect } from 'react';
import { User, Upload, FileText, TrendingUp, Bell, Key, Eye, EyeOff } from 'lucide-react';
import Dropdown from '../components/Dropdown';
import styles from './Setting.module.css';
import logo from '../assets/logo.png';
import { settingAPI, authAPI } from '../services/api';

export default function Setting() {
  const [tax, setTax] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState('');

  const [settingForm, setSettingForm] = useState({
    namaToko: '', hp: '', alamat: '', email: '',
    logo: null, logoPreview: null,
  });

  const [pwdForm, setPwdForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });

  useEffect(() => { fetchSetting(); }, []);

  const fetchSetting = async () => {
    try {
      const res = await settingAPI.get();
      const s = res.data.data || {};
      setSettingForm({
        namaToko: s.storeName || '',
        hp: s.phone || '',
        alamat: s.address || '',
        email: s.email || '',
        logo: null,
        logoPreview: s.logo || null,
      });
      setTax(s.taxRate ? String(s.taxRate) : '');
    } catch (err) {
      console.error('Gagal load setting:', err);
    }
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // FIX: Pisahkan update teks profil dengan upload logo
  const handleSaveProfil = async () => {
    try {
      setSubmitting(true);

      // 1. Update data teks (JSON biasa)
      await settingAPI.update({
        storeName: settingForm.namaToko,
        phone: settingForm.hp,
        address: settingForm.alamat,
        email: settingForm.email,
        taxRate: tax ? Number(tax) : undefined,
        taxEnabled: !!tax,
      });

      // 2. Jika ada logo baru, upload via endpoint khusus
      if (settingForm.logo) {
        const formData = new FormData();
        formData.append('logo', settingForm.logo);
        await settingAPI.updateLogo(formData);
        // Reset file logo setelah upload
        setSettingForm(p => ({ ...p, logo: null }));
      }

      showToast('✅ Profil toko berhasil disimpan');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan profil');
    } finally {
      setSubmitting(false);
    }
  };

  // FIX: Gunakan PUT /api/auth/change-password yang sudah tersedia
  const handleChangePassword = async () => {
    if (!pwdForm.currentPassword || !pwdForm.newPassword) {
      return alert('Isi semua field password!');
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      return alert('Password baru tidak cocok!');
    }
    if (pwdForm.newPassword.length < 6) {
      return alert('Password baru minimal 6 karakter!');
    }

    try {
      setSubmitting(true);
      await authAPI.changePassword({
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('✅ Password berhasil diubah');
    } catch (err) {
      alert(err.response?.data?.message || 'Password saat ini salah atau terjadi error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className={styles.settingContainer}>

      {/* Toast */}
      {notification && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px',
          background: '#000', color: '#fff', padding: '12px 20px',
          borderRadius: '8px', zIndex: 9999, fontSize: '14px',
        }}>
          {notification}
        </div>
      )}

      {/* Profil Toko */}
      <div className={`${styles.card} ${styles.profileCard}`}>
        <div className={styles.cardHeader}><User size={20} /><span>Profile Toko</span></div>
        <p className={styles.cardSubtitle}>Update dan kelola semua Profile toko disini.</p>

        <div className={styles.profileTop}>
          <div className={styles.avatar}>
            <img
              src={settingForm.logoPreview || logo}
              alt="Store Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
          <label className={styles.uploadBtn} style={{ cursor: 'pointer' }}>
            <Upload size={16} /> Ganti Foto
            <input
              type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files[0];
                if (file) setSettingForm(p => ({
                  ...p,
                  logo: file,
                  logoPreview: URL.createObjectURL(file),
                }));
              }}
            />
          </label>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Nama Toko</label>
            <div className={styles.inputWrapper}>
              <input
                type="text" value={settingForm.namaToko}
                onChange={e => setSettingForm(p => ({ ...p, namaToko: e.target.value }))}
                placeholder="Nama toko"
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Nomer HP</label>
            <div className={styles.inputWrapper}>
              <input
                type="text" value={settingForm.hp}
                onChange={e => setSettingForm(p => ({ ...p, hp: e.target.value }))}
                placeholder="Nomor HP"
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Alamat Toko</label>
            <div className={styles.inputWrapper}>
              <input
                type="text" value={settingForm.alamat}
                onChange={e => setSettingForm(p => ({ ...p, alamat: e.target.value }))}
                placeholder="Alamat toko"
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <div className={styles.inputWrapper}>
              <input
                type="email" value={settingForm.email}
                onChange={e => setSettingForm(p => ({ ...p, email: e.target.value }))}
                placeholder="Email toko"
              />
            </div>
          </div>
        </div>

        <div className={styles.cardActions}>
          <button className={styles.btnOutlineDanger} onClick={handleLogout}>Keluar Akun</button>
          <button className={styles.btnPrimary} onClick={handleSaveProfil} disabled={submitting}>
            {submitting ? '⏳ Menyimpan...' : 'Simpan Profil'}
          </button>
        </div>
      </div>

      {/* Pajak PPN */}
      <div className={styles.card}>
        <div className={styles.cardHeader}><TrendingUp size={20} /><span>Pajak PPN</span></div>
        <p className={styles.cardSubtitle}>Isi pajak PPN untuk menghitung total pembayaran.</p>
        <div className={styles.formGroup}>
          <label>Terapkan Pajak</label>
          <div className={styles.inputWrapper} style={{ border: 'none', padding: 0 }}>
            <Dropdown
              options={[
                { value: '', label: 'Tidak Ada Pajak' },
                { value: '10', label: 'PPN 10%' },
                { value: '20', label: 'PPN 20%' },
              ]}
              value={tax}
              onChange={setTax}
              placeholder="Tentukan pajak"
            />
          </div>
        </div>
        <div className={styles.cardActions}>
          <button className={styles.btnPrimary} onClick={handleSaveProfil} disabled={submitting}>
            {submitting ? '⏳...' : 'Simpan Pajak'}
          </button>
        </div>
      </div>

      {/* Notifikasi */}
      <div className={styles.card}>
        <div className={styles.cardHeader}><Bell size={20} /><span>Notifikasi</span></div>
        <p className={styles.cardSubtitle}>Hidupkan notifikasi guna sebagai pengingat.</p>
        <div className={styles.toggleRow}>
          <label className={styles.switch}>
            <input type="checkbox" defaultChecked />
            <span className={styles.slider}></span>
          </label>
          <span className={styles.toggleLabel}>Stock Kritis</span>
        </div>
        <div className={styles.toggleRow} style={{ marginBottom: 0 }}>
          <label className={styles.switch}>
            <input type="checkbox" defaultChecked />
            <span className={styles.slider}></span>
          </label>
          <span className={styles.toggleLabel}>Pengingat Laporan</span>
        </div>
      </div>

      {/* Format Struk */}
      <div className={styles.card}>
        <div className={styles.cardHeader}><FileText size={20} /><span>Format Struk</span></div>
        <p className={styles.cardSubtitle}>Isi format struk untuk bukti pembayaran</p>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Nama Toko</label>
            <div className={styles.inputWrapper}>
              <input type="text" value={settingForm.namaToko} readOnly placeholder="Otomatis dari profil" />
            </div>
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Alamat Toko</label>
            <div className={styles.inputWrapper}>
              <input type="text" value={settingForm.alamat} readOnly placeholder="Otomatis dari profil" />
            </div>
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Nomor Telepon Toko</label>
            <div className={styles.inputWrapper}>
              <input type="text" value={settingForm.hp} readOnly placeholder="Otomatis dari profil" />
            </div>
          </div>
        </div>
      </div>

      {/* Ganti Password */}
      <div className={styles.card}>
        <div className={styles.cardHeader}><Key size={20} /><span>Ganti Password</span></div>
        <p className={styles.cardSubtitle}>Ganti password akun secara berkala.</p>
        <div className={styles.formGrid}>
          {[
            { label: 'Password Saat Ini', key: 'currentPassword', show: showPassword1, setShow: setShowPassword1 },
            { label: 'Password Baru', key: 'newPassword', show: showPassword2, setShow: setShowPassword2 },
            { label: 'Konfirmasi Password Baru', key: 'confirmPassword', show: showPassword3, setShow: setShowPassword3 },
          ].map(({ label, key, show, setShow }) => (
            <div key={key} className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>{label}</label>
              <div className={styles.inputWrapper}>
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={pwdForm[key]}
                  onChange={e => setPwdForm(p => ({ ...p, [key]: e.target.value }))}
                />
                {show
                  ? <Eye onClick={() => setShow(false)} size={18} className={styles.iconRight} />
                  : <EyeOff onClick={() => setShow(true)} size={18} className={styles.iconRight} />
                }
              </div>
            </div>
          ))}
        </div>
        <div className={styles.cardActions}>
          <button
            className={styles.btnPrimary}
            onClick={handleChangePassword}
            disabled={submitting}
          >
            {submitting ? '⏳...' : 'Ganti Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
