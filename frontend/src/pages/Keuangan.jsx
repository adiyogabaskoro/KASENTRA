import { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Edit2, Trash2, ChevronLeft, ChevronRight, X, CheckCircle } from 'lucide-react';
import Dropdown from '../components/Dropdown';
import { PeriodeDropdown, DateFilterBtn } from '../components/PeriodFilter';
import styles from './Keuangan.module.css';
import { financeAPI } from '../services/api';

export default function Keuangan() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showRows, setShowRows] = useState('5');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [periode, setPeriode] = useState('Bulanan');
  const [dateValue, setDateValue] = useState(null);

  const [modalForm, setModalForm] = useState({
    type: 'Masuk',       // backend: type (kapital: 'Masuk'/'Keluar')
    category: 'modal',   // backend: category
    date: new Date().toISOString().substring(0, 10),  // backend: date
    desc: '',            // backend: desc
    amount: '',          // backend: amount
  });

  useEffect(() => { fetchFinance(); }, []);

  const fetchFinance = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await financeAPI.getAll();
      setTransactions(res.data.data || []);
    } catch (err) {
      setError('Gagal memuat data keuangan.');
    } finally { setLoading(false); }
  };

  const showToast = (msg) => {
    setNotificationMessage(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleAddTransaction = async () => {
    if (!modalForm.amount || !modalForm.desc) return alert('Nominal dan keterangan wajib diisi!');
    try {
      setSubmitting(true);
      await financeAPI.create(modalForm);
      await fetchFinance();
      setShowAddModal(false);
      setModalForm({ type: 'Masuk', category: 'modal', date: new Date().toISOString().substring(0, 10), desc: '', amount: '' });
      showToast('Sukses, Transaksi berhasil ditambahkan');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menambah transaksi');
    } finally { setSubmitting(false); }
  };

  const confirmDelete = async () => {
    try {
      setSubmitting(true);
      await financeAPI.delete(itemToDelete);
      await fetchFinance();
      setShowDeleteModal(false);
      setItemToDelete(null);
      showToast('Sukses, Transaksi berhasil dihapus');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus transaksi');
    } finally { setSubmitting(false); }
  };

  const formatTanggal = (tgl) => {
    if (!tgl) return '-';
    return new Date(tgl).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const filtered = transactions.filter(t => {
    if (filterCategory && (t.category || t.kategori || '').toLowerCase() !== filterCategory) return false;
    if (filterType && (t.type || t.tipe || '').toLowerCase() !== filterType) return false;
    return true;
  });

  const itemsPerPage = parseInt(showRows);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const current = filtered.slice(startIndex, startIndex + itemsPerPage);

  const totalMasuk = transactions.filter(t => (t.type || t.tipe || '').toLowerCase() === 'masuk').reduce((s, t) => s + (t.amount || t.nominal || 0), 0);
  const totalKeluar = transactions.filter(t => (t.type || t.tipe || '').toLowerCase() === 'keluar').reduce((s, t) => s + (t.amount || t.nominal || 0), 0);

  return (
    <div className={styles.keuanganContainer}>
      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ color: '#16a34a', fontSize: '13px', marginBottom: '4px' }}>Total Pemasukan</div>
          <div style={{ fontWeight: '700', fontSize: '18px' }}>Rp {totalMasuk.toLocaleString('id-ID')}</div>
        </div>
        <div style={{ flex: 1, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px' }}>
          <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '4px' }}>Total Pengeluaran</div>
          <div style={{ fontWeight: '700', fontSize: '18px' }}>Rp {totalKeluar.toLocaleString('id-ID')}</div>
        </div>
        <div style={{ flex: 1, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px' }}>
          <div style={{ color: '#2563eb', fontSize: '13px', marginBottom: '4px' }}>Saldo Bersih</div>
          <div style={{ fontWeight: '700', fontSize: '18px' }}>Rp {(totalMasuk - totalKeluar).toLocaleString('id-ID')}</div>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: '#dc2626' }}>
          ⚠️ {error} <button onClick={fetchFinance} style={{ marginLeft: '8px', textDecoration: 'underline', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>Coba lagi</button>
        </div>
      )}

      {/* Toolbar / Filters */}
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.filterGroup} style={{ border: 'none', padding: 0 }}>
            <Dropdown options={[{ value: '', label: 'Semua Kategori' }, { value: 'modal', label: 'Modal' }, { value: 'penjualan', label: 'Penjualan' }, { value: 'operasional', label: 'Operasional' }, { value: 'gaji', label: 'Gaji' }]}
              value={filterCategory} onChange={v => { setFilterCategory(v); setCurrentPage(1); }} placeholder="Kategori" />
          </div>
          <div className={styles.filterGroup} style={{ border: 'none', padding: 0 }}>
            <Dropdown options={[{ value: '', label: 'Semua Jenis' }, { value: 'masuk', label: 'Masuk' }, { value: 'keluar', label: 'Keluar' }]}
              value={filterType} onChange={v => { setFilterType(v); setCurrentPage(1); }} placeholder="Jenis" />
          </div>
          <div className={styles.filterGroup} style={{ border: 'none', padding: 0 }}>
            <PeriodeDropdown value={periode} onChange={p => { setPeriode(p); setDateValue(null); }} />
          </div>
          <div className={styles.filterGroup} style={{ border: 'none', padding: 0 }}>
            <DateFilterBtn periode={periode} value={dateValue} onChange={setDateValue} />
          </div>
        </div>
        <button className={styles.btnAdd} onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Tambah Transaksi
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>⏳ Memuat data...</div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr><th>No</th><th>Tanggal</th><th>Kategori</th><th>Jenis</th><th>Nominal</th><th>Keterangan</th><th>AKSI</th></tr>
              </thead>
              <tbody>
                {current.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>Belum ada transaksi keuangan.</td></tr>
                ) : current.map((t, i) => (
                  <tr key={t._id}>
                    <td>{startIndex + i + 1}</td>
                    <td>{formatTanggal(t.date || t.tanggal || t.createdAt)}</td>
                    <td style={{ textTransform: 'capitalize' }}>{t.category || t.kategori}</td>
                    <td>
                      <span style={{ color: (t.type||t.tipe||'').toLowerCase() === 'masuk' ? '#16a34a' : '#dc2626', fontWeight: '600', textTransform: 'capitalize' }}>{t.type || t.tipe}</span>
                    </td>
                    <td>Rp {Number(t.amount || t.nominal || 0).toLocaleString('id-ID')}</td>
                    <td>{t.desc || t.keterangan}</td>
                    <td>
                      <div className={styles.actionCell}>
                        <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => { setItemToDelete(t._id); setShowDeleteModal(true); }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.tableFooter}>
            <div className={styles.showRows}>
              <span>Show</span>
              <Dropdown options={[{ value: '5', label: '5' }, { value: '10', label: '10' }, { value: '20', label: '20' }]} value={showRows} onChange={v => { setShowRows(v); setCurrentPage(1); }} />
              <span>per page</span>
            </div>
            <div className={styles.pagination}>
              <span>{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length}</span>
              <button className={styles.pageNav} onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}><ChevronLeft size={18} /></button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                <button key={p} className={`${styles.pageBtn} ${currentPage === p ? styles.active : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
              ))}
              <button className={styles.pageNav} onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages || totalPages === 0}><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Tambah Transaksi</h2>
              <button className={styles.btnClose} onClick={() => setShowAddModal(false)}><X size={24} /></button>
            </div>
            <div className={styles.formBody}>
              <div className={styles.formGroup}>
                <label>Jenis Transaksi</label>
                <Dropdown options={[{ value: 'Masuk', label: 'Masuk' }, { value: 'Keluar', label: 'Keluar' }]} value={modalForm.type} onChange={v => setModalForm(p => ({ ...p, type: v }))} placeholder="Pilih Jenis" />
              </div>
              <div className={styles.formGroup}>
                <label>Kategori</label>
                <Dropdown options={[{ value: 'modal', label: 'Modal' }, { value: 'penjualan', label: 'Penjualan' }, { value: 'operasional', label: 'Operasional' }, { value: 'gaji', label: 'Gaji' }]} value={modalForm.category} onChange={v => setModalForm(p => ({ ...p, category: v }))} placeholder="Pilih Kategori" />
              </div>
              <div className={styles.formGroup}>
                <label>Tanggal</label>
                <input type="date" className={styles.filterSelect} style={{ width: '100%' }} value={modalForm.date} onChange={e => setModalForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div className={styles.formGroup}>
                <label>Keterangan</label>
                <input type="text" className={styles.filterSelect} value={modalForm.desc} onChange={e => setModalForm(p => ({ ...p, desc: e.target.value }))} placeholder="Keterangan transaksi" />
              </div>
              <div className={styles.formGroup}>
                <label>Nominal</label>
                <input type="number" className={styles.filterSelect} value={modalForm.amount} onChange={e => setModalForm(p => ({ ...p, amount: e.target.value }))} placeholder="Rp 0" />
              </div>
              <div className={styles.formActions}>
                <button className={styles.btnCancel} onClick={() => setShowAddModal(false)}>Batal</button>
                <button className={styles.btnSave} onClick={handleAddTransaction} disabled={submitting}>{submitting ? '⏳ Menyimpan...' : 'Simpan'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '400px' }}>
            <div className={`${styles.modalHeader} ${styles.danger}`}>
              <h2 style={{ marginLeft: 0 }}>Hapus Transaksi</h2>
              <button className={styles.btnClose} onClick={() => setShowDeleteModal(false)}><X size={24} /></button>
            </div>
            <p className={styles.dangerText}>Apakah Anda yakin ingin menghapus catatan transaksi ini? Data akan terhapus permanen.</p>
            <div className={styles.formActions} style={{ marginTop: 0 }}>
              <button className={styles.btnCancel} onClick={() => setShowDeleteModal(false)}>Batal</button>
              <button className={styles.btnDelete} onClick={confirmDelete} disabled={submitting}>{submitting ? '⏳...' : 'Hapus'}</button>
            </div>
          </div>
        </div>
      )}

      {showNotification && (
        <div className={styles.notification}><CheckCircle size={20} />{notificationMessage}</div>
      )}
    </div>
  );
}
