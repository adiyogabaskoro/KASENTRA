// ============================================================
// KASENTRA — TransaksiKasir.jsx (VERSI BARU — Terhubung ke Backend)
//
// Perubahan dari versi lama:
//   ❌ Sebelum: data dummy hardcoded array
//   ✅ Sekarang: fetch transaksi dari API, tampilkan data real
// ============================================================

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './TransaksiKasir.module.css';
import { transactionAPI, settingAPI } from '../services/api';

// Helper format waktu Indonesia
function formatWaktu(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
}

// Helper format tanggal Indonesia
function formatTanggal(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Helper format rupiah
function formatRp(n) {
  return 'Rp' + Number(n || 0).toLocaleString('id-ID');
}

export default function TransaksiKasir() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

  // Info toko untuk ditampilkan di struk
  const [storeSetting, setStoreSetting] = useState(null);

  // ============================================================
  // FETCH DATA saat halaman dibuka
  // ============================================================
  useEffect(() => {
    fetchTransactions();
    fetchStoreSetting();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      // Ambil kasir yang sedang login
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      // Kasir hanya melihat transaksinya sendiri (filter by kasir ID)
      const params = user.role === 'kasir' ? { kasir: user._id || user.id } : {};
      const res = await transactionAPI.getAll(params);
      setTransactions(res.data.data || []);
    } catch (err) {
      setError('Gagal memuat riwayat transaksi. Pastikan backend berjalan.');
      console.error('Error fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreSetting = async () => {
    try {
      const res = await settingAPI.get();
      setStoreSetting(res.data.data || null);
    } catch (err) {
      // Tidak kritis — struk tetap tampil meski setting gagal
      console.warn('Gagal load setting toko:', err);
    }
  };

  // Hitung sub total dari items transaksi yang dipilih
  const subTotal = selectedTx
    ? selectedTx.items.reduce((sum, i) => sum + (i.subtotal || i.hargaJual * i.qty || 0), 0)
    : 0;
  const totalDiskon = selectedTx?.diskon ?? 0;
  const total = selectedTx?.total ?? subTotal - totalDiskon;

  // ============================================================
  // RENDER — Loading state
  // ============================================================
  if (loading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Riwayat Transaksi</h2>
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          ⏳ Memuat data transaksi...
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER — Error state
  // ============================================================
  if (error) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Riwayat Transaksi</h2>
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          padding: '16px',
          color: '#dc2626',
          textAlign: 'center',
        }}>
          ⚠️ {error}
          <br />
          <button
            onClick={fetchTransactions}
            style={{ marginTop: '12px', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER — Empty state
  // ============================================================
  if (transactions.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Riwayat Transaksi</h2>
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          📋 Belum ada transaksi hari ini.
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER — Main content
  // ============================================================
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Riwayat Transaksi</h2>

      <table>
        <thead>
          <tr>
            <th>ID Order</th>
            <th>Waktu</th>
            <th>Nominal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id}>
              {/* Tampilkan noTransaksi (dari backend) atau fallback ke _id */}
              <td>{tx.noTransaksi || tx._id?.slice(-8)}</td>
              <td>
                {formatTanggal(tx.createdAt)}, {formatWaktu(tx.createdAt)}
              </td>
              <td>{formatRp(tx.total)}</td>
              <td style={{ textAlign: 'right' }}>
                <button
                  className={styles.lihatRincian}
                  onClick={() => setSelectedTx(tx)}
                >
                  Lihat Rincian
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ========================================================
          MODAL RINCIAN TRANSAKSI
          ======================================================== */}
      {selectedTx && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTx(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

            <h2 className={styles.modalTitle}>Riwayat Transaksi</h2>
            <button className={styles.btnClose} onClick={() => setSelectedTx(null)}>
              <X size={22} />
            </button>

            {/* Info Toko — dari API setting */}
            <div className={styles.storeHeader}>
              <div>{storeSetting?.namaToko || '(Nama Toko)'}</div>
              <div>{storeSetting?.alamat || '(Alamat Toko)'}</div>
              <div>{storeSetting?.hp || '(No. Telepon)'}</div>
            </div>

            {/* Info Transaksi */}
            <table className={styles.infoTable}>
              <tbody>
                <tr>
                  <td>ID Order</td>
                  <td>{selectedTx.noTransaksi || selectedTx._id?.slice(-8)}</td>
                </tr>
                <tr>
                  <td>Waktu</td>
                  <td>{formatWaktu(selectedTx.createdAt)}</td>
                </tr>
                <tr>
                  <td>Tanggal</td>
                  <td>{formatTanggal(selectedTx.createdAt)}</td>
                </tr>
                <tr>
                  <td>Metode Pembayaran</td>
                  {/* Backend simpan lowercase: 'tunai' | 'qris' */}
                  <td style={{ textTransform: 'capitalize' }}>
                    {selectedTx.paymentMethod}
                  </td>
                </tr>
                <tr>
                  <td>Kasir</td>
                  {/* kasirName disimpan langsung di dokumen transaksi */}
                  <td>{selectedTx.kasirName || selectedTx.kasir?.name || '-'}</td>
                </tr>
              </tbody>
            </table>

            <hr className={styles.dashed} />

            {/* Daftar Item */}
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Jumlah</th>
                  <th>Item</th>
                  <th>Harga</th>
                </tr>
              </thead>
              <tbody>
                {(selectedTx.items || []).map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.qty}</td>
                    <td style={{ textAlign: 'center' }}>
                      {/* Backend simpan sebagai 'productName' */}
                      {item.productName || item.nama || '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {formatRp(item.subtotal || item.hargaJual * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr className={styles.dashed} />

            {/* Total */}
            <div className={styles.totalsSection}>
              <div className={styles.totalRow}>
                <span>Sub Total</span>
                <span>{formatRp(selectedTx.subTotal ?? subTotal)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Diskon</span>
                <span>{formatRp(selectedTx.diskon ?? 0)}</span>
              </div>
              {(selectedTx.pajak ?? 0) > 0 && (
                <div className={styles.totalRow}>
                  <span>Pajak</span>
                  <span>{formatRp(selectedTx.pajak)}</span>
                </div>
              )}
              <div className={styles.grandTotal}>
                <span>Total</span>
                <span>{formatRp(selectedTx.total ?? total)}</span>
              </div>
              {selectedTx.paymentMethod === 'tunai' && (
                <>
                  <div className={styles.totalRow}>
                    <span>Bayar</span>
                    <span>{formatRp(selectedTx.bayar)}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Kembalian</span>
                    <span>{formatRp(selectedTx.kembalian)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className={styles.modalActions}>
              <button className={styles.btnCetak} onClick={() => window.print()}>
                Cetak Ulang Struk
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
