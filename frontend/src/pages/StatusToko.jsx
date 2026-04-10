// ============================================================
// KASENTRA — StatusToko.jsx (VERSI BARU — Terhubung ke Backend)
//
// Perubahan dari versi lama:
//   ❌ Sebelum: status toko hanya disimpan di state React (reset saat refresh)
//   ✅ Sekarang: status toko disimpan di MongoDB via settingAPI.toggleStatus()
//               + rekap tutup toko diambil dari transaksi hari ini
// ============================================================

import { useState, useEffect } from 'react';
import { Store, LogIn, LogOut, CheckCircle } from 'lucide-react';
import bukaTokoImg from '../assets/buka-toko.png';
import tutupTokoImg from '../assets/tutup-toko.png';
import './StatusToko.css';
import { settingAPI, transactionAPI } from '../services/api';

const StatusToko = () => {
  const [isTokoOpen, setIsTokoOpen]       = useState(false);
  const [modalAwal, setModalAwal]         = useState('');
  const [showBukaModal, setShowBukaModal] = useState(false);
  const [showTutupModal, setShowTutupModal] = useState(false);
  const [inputError, setInputError]       = useState('');
  const [toast, setToast]                 = useState(null);
  const [loading, setLoading]             = useState(true);
  const [submitting, setSubmitting]       = useState(false);

  // Rekap sesi untuk modal tutup toko
  const [rekapTransaksi, setRekapTransaksi]   = useState(0);
  const [rekapPendapatan, setRekapPendapatan] = useState(0);

  // ── Ambil status toko saat halaman dibuka ─────────────────
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await settingAPI.get();
      setIsTokoOpen(res.data.data?.isOpen || false);
    } catch (err) {
      console.error('Gagal load status toko:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRekap = async () => {
    try {
      // Ambil transaksi hari ini untuk rekap tutup toko
      const today = new Date().toISOString().split('T')[0];
      const res = await transactionAPI.getAll({ startDate: today, endDate: today });
      const txs = res.data.data || [];
      setRekapTransaksi(txs.length);
      setRekapPendapatan(txs.reduce((s, t) => s + (t.total || 0), 0));
    } catch (err) {
      console.error('Gagal load rekap:', err);
    }
  };

  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Buka Toko — kirim toggle ke backend ───────────────────
  const handleBukaToko = async () => {
    if (!modalAwal) {
      setInputError('Mohon masukkan modal awal!');
      return;
    }
    try {
      setSubmitting(true);
      await settingAPI.toggleStatus({});
      setIsTokoOpen(true);
      setShowBukaModal(false);
      setInputError('');
      showToast('Sukses', 'Berhasil membuka toko.');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal membuka toko');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Tutup Toko — kirim toggle ke backend ──────────────────
  const handleTutupToko = async () => {
    try {
      setSubmitting(true);
      await settingAPI.toggleStatus({});
      setIsTokoOpen(false);
      setShowTutupModal(false);
      setModalAwal('');
      showToast('Data Tersimpan', 'Berhasil menutup toko.');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menutup toko');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenTutupModal = async () => {
    await fetchRekap(); // ambil data terbaru dulu
    setShowTutupModal(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const cleanValue = value.replace(/[^0-9.]/g, '');
    setInputError(value !== cleanValue ? 'Hanya boleh angka! Coba lagi.' : '');
    setModalAwal(cleanValue);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const cleanValue = pastedText.replace(/[^0-9.]/g, '');
    setInputError(pastedText !== cleanValue ? 'Hanya boleh angka! Coba lagi.' : '');
    setModalAwal(cleanValue);
  };

  const fmtRp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

  if (loading) {
    return (
      <div className="status-toko-page">
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
          ⏳ Memuat status toko...
        </div>
      </div>
    );
  }

  return (
    <div className="status-toko-page">
      <div className="status-grid">

        {/* Buka Toko */}
        <div className="status-card">
          <div className="card-content">
            <div className="card-text">
              <div className="status-badge">
                <Store size={16} />
                <span>Status Toko</span>
                <span className={`status-indicator ${isTokoOpen ? 'open' : 'closed'}`}>
                  {isTokoOpen ? 'Buka' : 'Tutup'}
                </span>
              </div>
              <h2>Buka Toko hari Ini?</h2>
              <p>Klik disini untuk mengaktifkan sesi kasir dan memulai transaksi hari ini.</p>
              <button
                className="btn-buka-toko"
                onClick={() => setShowBukaModal(true)}
                disabled={isTokoOpen || submitting}
              >
                <LogIn size={18} />
                Klik Buka Toko
              </button>
            </div>
            <div className="card-illustration">
              <img src={bukaTokoImg} alt="Buka Toko" />
            </div>
          </div>
        </div>

        {/* Tutup Toko */}
        <div className="status-card">
          <div className="card-content">
            <div className="card-text">
              <h2>Tutup Toko</h2>
              <p>Klik disini untuk melihat rekapitulasi transaksi dan total pendapatan sebelum mengakhiri sesi.</p>
              <button
                className="btn-tutup-toko"
                onClick={handleOpenTutupModal}
                disabled={!isTokoOpen || submitting}
              >
                <LogOut size={18} />
                Klik Tutup Toko
              </button>
            </div>
            <div className="card-illustration">
              <img src={tutupTokoImg} alt="Tutup Toko" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Buka Toko */}
      {showBukaModal && (
        <div className="modal-overlay" onClick={() => setShowBukaModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title-blue">Buka Sesi Toko</h3>
              <button className="modal-close" onClick={() => setShowBukaModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Modal Awal</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">Rp.</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="240.000"
                    value={modalAwal}
                    onChange={handleInputChange}
                    onPaste={handlePaste}
                    autoFocus
                    className={inputError ? 'input-error' : ''}
                    disabled={submitting}
                  />
                </div>
                {inputError && <div className="error-message">{inputError}</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-batal" onClick={() => setShowBukaModal(false)} disabled={submitting}>
                Batal
              </button>
              <button className="btn-konfirmasi" onClick={handleBukaToko} disabled={submitting}>
                {submitting ? '⏳...' : 'Konfirmasi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tutup Toko */}
      {showTutupModal && (
        <div className="modal-overlay" onClick={() => setShowTutupModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title-red">Tutup Toko</h3>
              <button className="modal-close" onClick={() => setShowTutupModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <h4 className="rekap-title">Rekap Sesi Hari Ini</h4>
              <div className="rekap-box">
                <div className="rekap-row">
                  <span>Total Transaksi</span>
                  <strong>{rekapTransaksi}</strong>
                </div>
                <div className="rekap-row rekap-row-last">
                  <span>Total Pendapatan</span>
                  <strong>{fmtRp(rekapPendapatan)}</strong>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-batal" onClick={() => setShowTutupModal(false)} disabled={submitting}>
                Batal
              </button>
              <button className="btn-konfirmasi" onClick={handleTutupToko} disabled={submitting}>
                {submitting ? '⏳...' : 'Konfirmasi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="toast-success">
          <CheckCircle size={22} />
          <div>
            <div className="toast-title">{toast.title}</div>
            <div className="toast-message">{toast.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusToko;
