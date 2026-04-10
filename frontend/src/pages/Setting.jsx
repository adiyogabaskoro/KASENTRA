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

  // Setting toko dari API
  const [settingForm, setSettingForm] = useState({
    namaToko: '', hp: '', alamat: '', email: '',
    logo: null, logoPreview: null,
  });

  // Ganti password
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => { fetchSetting(); }, []);

  const fetchSetting = async () => {
    try {
      const res = await settingAPI.get();
      const s = res.data.data || {};
      setSettingForm({
        namaToko: s.storeName || s.namaToko || '',
        hp: s.phone || s.hp || '',
        alamat: s.address || s.alamat || '',
        email: s.email || '',
        logo: null,
        logoPreview: s.logo || null,
      });
      setTax(s.pajak || '');
    } catch (err) {
      console.error('Gagal load setting:', err);
    }
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSaveProfil = async () => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('storeName', settingForm.namaToko);
      formData.append('phone', settingForm.hp);
      formData.append('address', settingForm.alamat);
      formData.append('email', settingForm.email);
      if (settingForm.logo) formData.append('logo', settingForm.logo);
      await settingAPI.update(formData);
      showToast('✅ Profil toko berhasil disimpan');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan profil');
    } finally { setSubmitting(false); }
  };

  const handleChangePassword = async () => {
    if (!pwdForm.currentPassword || !pwdForm.newPassword) return alert('Isi semua field password!');
    if (pwdForm.newPassword !== pwdForm.confirmPassword) return alert('Password baru tidak cocok!');
    try {
      setSubmitting(true);
      // Gunakan endpoint auth/change-password atau user update
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      // Coba login dulu dengan password lama untuk verifikasi
      await authAPI.login({ username: user.username, password: pwdForm.currentPassword, role: user.role });
      // Kalau berhasil, update password
      const { userAPI } = await import('../services/api');
      await userAPI.update(user._id, { password: pwdForm.newPassword });
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('✅ Password berhasil diperbarui');
    } catch (err) {
      alert(err.response?.data?.message || 'Password saat ini salah atau terjadi error');
    } finally { setSubmitting(false); }
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
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#000', color: '#fff', padding: '12px 20px', borderRadius: '8px', zIndex: 9999, fontSize: '14px' }}>
          {notification}
        </div>
      )}

      {/* Profile Toko */}
      <div className={`${styles.card} ${styles.profileCard}`}>
        <div className={styles.cardHeader}><User size={20} /><span>Profile Toko</span></div>
        <p className={styles.cardSubtitle}>Update dan kelola semua Profile toko disini.</p>

        <div className={styles.profileTop}>
          <div className={styles.avatar}>
            <img src={settingForm.logoPreview || logo} alt="Store Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          </div>
          <label className={styles.uploadBtn} style={{ cursor: 'pointer' }}>
            <Upload size={16} /> Ganti Foto
            <input type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files[0];
                if (file) setSettingForm(p => ({ ...p, logo: file, logoPreview: URL.createObjectURL(file) }));
              }} />
          </label>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Nama Toko</label>
            <div className={styles.inputWrapper}>
              <input type="text" value={settingForm.namaToko} onChange={e => setSettingForm(p => ({ ...p, namaToko: e.target.value }))} placeholder="Nama toko" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Nomer HP</label>
            <div className={styles.inputWrapper}>
              <input type="text" value={settingForm.hp} onChange={e => setSettingForm(p => ({ ...p, hp: e.target.value }))} placeholder="Nomor HP" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Alamat Toko</label>
            <div className={styles.inputWrapper}>
              <input type="text" value={settingForm.alamat} onChange={e => setSettingForm(p => ({ ...p, alamat: e.target.value }))} placeholder="Alamat toko" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <div className={styles.inputWrapper}>
              <input type="email" value={settingForm.email} onChange={e => setSettingForm(p => ({ ...p, email: e.target.value }))} placeholder="Email toko" />
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
            <Dropdown options={[{ value: '', label: 'Tidak Ada Pajak' }, { value: '10', label: 'PPN 10%' }, { value: '20', label: 'PPN 20%' }]} value={tax} onChange={setTax} placeholder="Tentukan pajak" />
          </div>
        </div>
      </div>

      {/* Notifikasi */}
      <div className={styles.card}>
        <div className={styles.cardHeader}><Bell size={20} /><span>Notifikasi</span></div>
        <p className={styles.cardSubtitle}>Hidupkan notifikasi guna sebagai pengingat.</p>
        <div className={styles.toggleRow}>
          <label className={styles.switch}><input type="checkbox" defaultChecked /><span className={styles.slider}></span></label>
          <span className={styles.toggleLabel}>Stock Kritis</span>
        </div>
        <div className={styles.toggleRow} style={{ marginBottom: 0 }}>
          <label className={styles.switch}><input type="checkbox" defaultChecked /><span className={styles.slider}></span></label>
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
            <div className={styles.inputWrapper}><input type="text" value={settingForm.namaToko} readOnly placeholder="Otomatis dari profil" /></div>
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Alamat Toko</label>
            <div className={styles.inputWrapper}><input type="text" value={settingForm.alamat} readOnly placeholder="Otomatis dari profil" /></div>
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Nomor Telepon Toko</label>
            <div className={styles.inputWrapper}><input type="text" value={settingForm.hp} readOnly placeholder="Otomatis dari profil" /></div>
          </div>
        </div>
        <div className={styles.cardActions}>
          <button className={styles.btnPrimary} onClick={handleSaveProfil} disabled={submitting}>Simpan Perubahan</button>
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
                <input type={show ? 'text' : 'password'} placeholder="Masukkan password"
                  value={pwdForm[key]} onChange={e => setPwdForm(p => ({ ...p, [key]: e.target.value }))} />
                {show ? <Eye onClick={() => setShow(false)} size={18} className={styles.iconRight} /> : <EyeOff onClick={() => setShow(true)} size={18} className={styles.iconRight} />}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.cardActions}>
          <button className={styles.btnPrimary} onClick={handleChangePassword} disabled={submitting}>
            {submitting ? '⏳...' : 'Ganti Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
