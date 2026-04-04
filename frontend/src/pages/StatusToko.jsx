import { useState } from 'react';
import { Store, LogIn, LogOut, CheckCircle } from 'lucide-react';
import bukaTokoImg from '../assets/buka-toko.png';
import tutupTokoImg from '../assets/tutup-toko.png';
import './StatusToko.css';

const StatusToko = () => {
  const [isTokoOpen, setIsTokoOpen] = useState(false);
  const [modalAwal, setModalAwal] = useState('');
  const [showBukaModal, setShowBukaModal] = useState(false);
  const [showTutupModal, setShowTutupModal] = useState(false);
  const [inputError, setInputError] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBukaToko = () => {
    if (!modalAwal) {
      setInputError('Mohon masukkan modal awal!');
      return;
    }
    setIsTokoOpen(true);
    setShowBukaModal(false);
    setInputError('');
    showToast('Sukses', 'Berhasil membuka toko.');
  };

  const handleTutupToko = () => {
    setIsTokoOpen(false);
    setShowTutupModal(false);
    setModalAwal('');
    showToast('Data Tersimpan', 'Berhasil menutup toko.');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const cleanValue = value.replace(/[^0-9.]/g, '');
    if (value !== cleanValue) {
      setInputError('Hanya boleh angka! Coba lagi.');
    } else {
      setInputError('');
    }
    setModalAwal(cleanValue);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const cleanValue = pastedText.replace(/[^0-9.]/g, '');
    if (pastedText !== cleanValue) {
      setInputError('Hanya boleh angka! Coba lagi.');
    } else {
      setInputError('');
    }
    setModalAwal(cleanValue);
  };

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
                disabled={isTokoOpen}
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
                onClick={() => setShowTutupModal(true)}
                disabled={!isTokoOpen}
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
                  />
                </div>
                {inputError && (
                  <div className="error-message">{inputError}</div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-batal" onClick={() => setShowBukaModal(false)}>
                Batal
              </button>
              <button className="btn-konfirmasi" onClick={handleBukaToko}>
                Konfirmasi
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
              <h4 className="rekap-title">Rekap Sesi</h4>
              <div className="rekap-box">
                <div className="rekap-row">
                  <span>Total Transaksi</span>
                  <strong>1</strong>
                </div>
                <div className="rekap-row rekap-row-last">
                  <span>Total Pendapatan</span>
                  <strong>Rp{modalAwal || '0'}</strong>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-batal" onClick={() => setShowTutupModal(false)}>
                Batal
              </button>
              <button className="btn-konfirmasi" onClick={handleTutupToko}>
                Konfirmasi
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
