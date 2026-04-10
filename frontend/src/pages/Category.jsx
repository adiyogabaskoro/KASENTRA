import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, ChevronLeft, ChevronRight, X, CheckCircle, Tag } from 'lucide-react';
import Dropdown from '../components/Dropdown';
import styles from './Category.module.css';
import { categoryAPI } from '../services/api';

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showRows, setShowRows] = useState('5');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await categoryAPI.getAll();
      setCategories(res.data.data || []);
    } catch (err) {
      setError('Gagal memuat kategori.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setNotificationMessage(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleAddCategory = async () => {
    if (!formData.name) return alert('Nama kategori wajib diisi!');
    try {
      setSubmitting(true);
      await categoryAPI.create({ name: formData.name, description: formData.description });
      await fetchCategories();
      setShowAddModal(false);
      setFormData({ name: '', description: '' });
      showToast('Sukses, Kategori berhasil ditambahkan');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menambah kategori');
    } finally { setSubmitting(false); }
  };

  const handleEditCategory = async () => {
    try {
      setSubmitting(true);
      await categoryAPI.update(selectedCategory._id, { name: formData.name, description: formData.description });
      await fetchCategories();
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData({ name: '', description: '' });
      showToast('Sukses, Kategori berhasil diperbarui');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memperbarui kategori');
    } finally { setSubmitting(false); }
  };

  const confirmDelete = async () => {
    try {
      setSubmitting(true);
      await categoryAPI.delete(selectedCategory._id);
      await fetchCategories();
      setShowDeleteModal(false);
      setSelectedCategory(null);
      showToast('Sukses, Kategori berhasil dihapus');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus kategori');
    } finally { setSubmitting(false); }
  };

  const handleEditClick = (cat) => {
    setSelectedCategory(cat);
    setFormData({ name: cat.nama || cat.name, description: cat.deskripsi || cat.description || '' });
    setShowEditModal(true);
  };

  const filtered = categories.filter(c =>
    (c.nama || c.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const itemsPerPage = parseInt(showRows);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const current = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={styles.categoryContainer}>
      <div className={styles.headerSection}>
        <div className={styles.titleArea}><Tag size={24} /><h2>Kelola Kategori</h2></div>
        <p className={styles.subtitle}>Kelola semua kategori produk toko disini.</p>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: '#dc2626' }}>
          ⚠️ {error} <button onClick={fetchCategories} style={{ marginLeft: '8px', textDecoration: 'underline', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>Coba lagi</button>
        </div>
      )}

      <div className={styles.toolbar}>
        <span className={styles.tableTitle}>Daftar Kategori Produk</span>
        <div className={styles.actions}>
          <div className={styles.searchGroup}>
            <Search size={16} className={styles.iconLeft} />
            <input type="text" placeholder="Cari Kategori" className={styles.searchInput} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className={styles.btnAdd} onClick={() => { setFormData({ name: '', description: '' }); setShowAddModal(true); }}>
            <Plus size={18} /> Tambah Kategori
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>⏳ Memuat data...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table>
            <thead><tr><th>No</th><th>Nama Kategori</th><th>Deskripsi</th><th>Jumlah Item</th><th>AKSI</th></tr></thead>
            <tbody>
              {current.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>Belum ada kategori.</td></tr>
              ) : current.map((cat, i) => (
                <tr key={cat._id}>
                  <td>{startIndex + i + 1}</td>
                  <td>{cat.nama || cat.name}</td>
                  <td>{cat.deskripsi || cat.description || '-'}</td>
                  <td>{cat.jumlahItem || 0} Item</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={`${styles.actionBtn} ${styles.edit}`} onClick={() => handleEditClick(cat)}><Edit2 size={16} /></button>
                      <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => { setSelectedCategory(cat); setShowDeleteModal(true); }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

      {/* Add Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Tambah Kategori Baru</h2>
              <button className={styles.btnClose} onClick={() => setShowAddModal(false)}><X size={24} /></button>
            </div>
            <div className={styles.formBody}>
              <div className={styles.formGroup}>
                <label>Nama Kategori</label>
                <input type="text" className={styles.inputField} value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Masukkan nama kategori" />
              </div>
              <div className={styles.formGroup}>
                <label>Deskripsi</label>
                <textarea className={styles.textareaField} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Masukkan deskripsi" rows="4" />
              </div>
              <div className={styles.formActions}>
                <button className={styles.btnCancel} onClick={() => setShowAddModal(false)}>Batal</button>
                <button className={styles.btnSave} onClick={handleAddCategory} disabled={submitting}>{submitting ? '⏳ Menyimpan...' : 'Simpan'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Kategori</h2>
              <button className={styles.btnClose} onClick={() => setShowEditModal(false)}><X size={24} /></button>
            </div>
            <div className={styles.formBody}>
              <div className={styles.formGroup}>
                <label>Nama Kategori</label>
                <input type="text" className={styles.inputField} value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className={styles.formGroup}>
                <label>Deskripsi</label>
                <textarea className={styles.textareaField} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows="4" />
              </div>
              <div className={styles.formActions}>
                <button className={styles.btnCancel} onClick={() => setShowEditModal(false)}>Batal</button>
                <button className={styles.btnSave} onClick={handleEditCategory} disabled={submitting}>{submitting ? '⏳ Menyimpan...' : 'Simpan'}</button>
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
              <h2 style={{ marginLeft: 0 }}>Hapus Kategori</h2>
              <button className={styles.btnClose} onClick={() => setShowDeleteModal(false)}><X size={24} /></button>
            </div>
            <p className={styles.dangerText}>Anda yakin akan menghapus kategori ini? Data akan terhapus secara permanen.</p>
            <div style={{ textAlign: 'center', fontWeight: '600', marginBottom: '32px' }}>{selectedCategory?.nama || selectedCategory?.name}</div>
            <div className={styles.formActions} style={{ marginTop: 0, justifyContent: 'center' }}>
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
