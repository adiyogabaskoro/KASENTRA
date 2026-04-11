import { useState } from 'react';
import { 
  User, 
  Upload, 
  FileText, 
  TrendingUp, 
  Bell, 
  Key, 
  Eye, 
  EyeOff,
  ChevronDown,
  Printer
} from 'lucide-react';
import Dropdown from '../components/Dropdown';
import styles from './Setting.module.css';
import logo from '../assets/logo.png'; 

export default function Setting() {
  const role = sessionStorage.getItem('userRole') || 'owner';

  const [tax, setTax] = useState('');
  const [shift, setShift] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [isPrinterConnected, setIsPrinterConnected] = useState(false);

  return (
    <div className={styles.settingContainer}>
      
      {/* ──────────────── PROFILE CARD (All Roles) ──────────────── */}
      <div className={`${styles.card} ${role === 'owner' ? styles.profileCard : ''}`}>
        <div className={styles.cardHeader}>
          <User size={20} />
          <span>
            {role === 'owner' ? 'Profile Toko' : 
             role === 'kasir' ? 'Profile Kasir' : 
             'Profile Operator'}
          </span>
        </div>
        <p className={styles.cardSubtitle}>
          {role === 'owner' 
            ? 'Update dan kelola semua Profile toko disini.' 
            : 'Update dan kelola semua Profilmu disini.'}
        </p>

        <div className={styles.profileTop}>
          <div className={styles.avatar}>
            <img src={logo} alt="Avatar" />
          </div>
          <button className={styles.uploadBtn}>
            <Upload size={16} /> Ganti Foto
          </button>
        </div>

        <div className={styles.formGrid}>
          {/* Owner fields */}
          {role === 'owner' && (
            <>
              <div className={styles.formGroup}>
                <label>Nama Toko</label>
                <div className={styles.inputWrapper}>
                  <input type="text" defaultValue="Toko Belle" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Nomer HP</label>
                <div className={styles.inputWrapper}>
                  <input type="text" defaultValue="(603) 555-0123" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Alamat Toko</label>
                <div className={styles.inputWrapper}>
                  <input type="text" defaultValue="Jl. Toko Bella" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <div className={styles.inputWrapper}>
                  <input type="email" defaultValue="tokobella@gmail.com" />
                </div>
              </div>
            </>
          )}

          {/* Kasir fields */}
          {role === 'kasir' && (
            <>
              <div className={styles.formGroup}>
                <label>Nama</label>
                <div className={styles.inputWrapper}>
                  <input type="text" defaultValue="Mia" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Nomer HP</label>
                <div className={styles.inputWrapper}>
                  <input type="text" defaultValue="+62 xxx-xxx-xxx-xxx" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Tentukan Shift</label>
                <div className={styles.inputWrapper} style={{ border: 'none', padding: 0 }}>
                  <Dropdown 
                    options={[
                      { value: 'shift1', label: 'Shift 1 > 08.00 - 16.00' },
                      { value: 'shift2', label: 'Shift 2 > 16.00 - 21.00' }
                    ]}
                    value={shift}
                    onChange={setShift}
                    placeholder="Tentukan shift"
                    className="lexend-font"
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <div className={styles.inputWrapper}>
                  <input type="email" defaultValue="tokobella@gmail.com" />
                </div>
              </div>
            </>
          )}

          {/* Operator fields */}
          {role === 'operator' && (
            <>
              <div className={styles.formGroup}>
                <label>Nama</label>
                <div className={styles.inputWrapper}>
                  <input type="text" defaultValue="Mia" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Nomor HP</label>
                <div className={styles.inputWrapper}>
                  <input type="text" defaultValue="+62 xxx-xxx-xxx-xxx" />
                </div>
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Email</label>
                <div className={styles.inputWrapper}>
                  <input type="email" defaultValue="tokobella@gmail.com" />
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.cardActions}>
          <button className={styles.btnOutlineDanger}>Keluar Akun</button>
          <button className={styles.btnPrimary}>Simpan Profil</button>
        </div>
      </div>

      {/* ──────────────── SECOND COLUMN ──────────────── */}
      
      {/* SAMBUNG PRINTER (Hanya Kasir) */}
      {role === 'kasir' && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Sambung ke Printer</span>
          </div>
          <p className={styles.cardSubtitle}>Sambungkan ke printer struk</p>

          <div className={styles.formGroup}>
            <label style={{ color: 'var(--color-gray-600)', fontWeight: 400, fontSize: '13px' }}>
              {isPrinterConnected ? 'Berhasil terhubung' : 'Perangkat yang tersedia saat ini'}
            </label>
            <div className={`${styles.printerBox} ${isPrinterConnected ? styles.printerBoxConnected : ''}`}>
              <Printer size={64} className={styles.printerIcon} />
              <span>Printer xxx</span>
            </div>
          </div>

          <div className={styles.cardActions}>
            {isPrinterConnected ? (
              <button 
                className={styles.btnDanger}
                onClick={() => setIsPrinterConnected(false)}
              >
                Putus Perangkat
              </button>
            ) : (
              <button 
                className={styles.btnPrimary}
                onClick={() => setIsPrinterConnected(true)}
              >
                Sambungkan
              </button>
            )}
          </div>
        </div>
      )}

      {/* PAJAK PPN & NOTIFIKASI (Hanya Owner) */}
      {role === 'owner' && (
        <>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <TrendingUp size={20} />
              <span>Pajak PPN</span>
            </div>
            <p className={styles.cardSubtitle}>Isi pajak PPN untuk menghitung total pembayaran.</p>

            <div className={styles.toggleRow}>
              <label className={styles.switch}>
                <input type="checkbox" />
                <span className={styles.slider}></span>
              </label>
              <span className={styles.toggleLabel}>Opsional</span>
            </div>

            <div className={styles.formGroup}>
              <label>Terapkan Pajak</label>
              <div className={styles.inputWrapper} style={{ border: 'none', padding: 0 }}>
                <Dropdown 
                  options={[
                    { value: '10', label: 'PPN 10%' },
                    { value: '20', label: 'PPN 20%' }
                  ]}
                  value={tax}
                  onChange={setTax}
                  placeholder="Tentukan pajak"
                  className="lexend-font"
                />
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Bell size={20} />
              <span>Notifikasi</span>
            </div>
            <p className={styles.cardSubtitle}>Hidupkan notifikasi guna sebagia pengingat.</p>

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
        </>
      )}

      {/* FORMAT STRUK (Owner & Kasir) */}
      {(role === 'owner' || role === 'kasir') && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <FileText size={20} />
            <span>Format Struk</span>
          </div>
          <p className={styles.cardSubtitle}>Isi format struk untuk bukti pembayaran</p>

          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Nama Toko</label>
              <div className={styles.inputWrapper}>
                <input type="text" placeholder="Input nama toko" />
              </div>
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Alamat Toko</label>
              <div className={styles.inputWrapper}>
                <input type="text" placeholder="Input alamat toko" />
              </div>
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Nomor Telepon Toko</label>
              <div className={styles.inputWrapper}>
                <input type="text" placeholder="Input nama toko" />
              </div>
            </div>
          </div>

          <div className={styles.cardActions}>
            <button className={styles.btnPrimary}>Simpan Perubahan</button>
          </div>
        </div>
      )}

      {/* GANTI PASSWORD (All Roles) */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Key size={20} />
          <span>Ganti Password</span>
        </div>
        <p className={styles.cardSubtitle}>Ganti password Profile toko secara berkala.</p>

        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Password Saat Ini</label>
            <div className={styles.inputWrapper}>
              <input 
                type={showPassword1 ? "text" : "password"} 
                placeholder="Masukkan password" 
              />
              {showPassword1 ? (
                <Eye onClick={() => setShowPassword1(false)} size={18} className={styles.iconRight} />
              ) : (
                <EyeOff onClick={() => setShowPassword1(true)} size={18} className={styles.iconRight} />
              )}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Password Baru</label>
            <div className={styles.inputWrapper}>
              <input 
                type={showPassword2 ? "text" : "password"} 
                placeholder="Masukkan password" 
              />
              {showPassword2 ? (
                <Eye onClick={() => setShowPassword2(false)} size={18} className={styles.iconRight} />
              ) : (
                <EyeOff onClick={() => setShowPassword2(true)} size={18} className={styles.iconRight} />
              )}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Konfirmasi Password Baru</label>
            <div className={styles.inputWrapper}>
              <input 
                type={showPassword3 ? "text" : "password"} 
                placeholder="Masukkan password" 
              />
              {showPassword3 ? (
                <Eye onClick={() => setShowPassword3(false)} size={18} className={styles.iconRight} />
              ) : (
                <EyeOff onClick={() => setShowPassword3(true)} size={18} className={styles.iconRight} />
              )}
            </div>
          </div>
        </div>

        <div className={styles.cardActions}>
          <button className={styles.btnPrimary}>Ganti Password</button>
        </div>
      </div>

    </div>
  );
}
