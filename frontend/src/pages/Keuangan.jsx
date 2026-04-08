import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  ChevronDown, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  X,
  CheckCircle
} from 'lucide-react';
import Dropdown from '../components/Dropdown';
import { PeriodeDropdown, DateFilterBtn } from '../components/PeriodFilter';
import styles from './Keuangan.module.css';

export default function Keuangan() {
  const [transactions, setTransactions] = useState([
    { id: 1, date: '22/03/2026', category: 'Modal', type: 'Masuk', amount: 500000, desc: 'Mulai sesi buka toko' },
    { id: 2, date: '22/03/2026', category: 'Penjualan', type: 'Masuk', amount: 150000, desc: 'Transaksi Kasir' },
    { id: 3, date: '22/03/2026', category: 'Operasional', type: 'Keluar', amount: 45000, desc: 'Beli Galon & Makan' },
    { id: 4, date: '22/03/2026', category: 'Restok', type: 'Keluar', amount: 120000, desc: 'Belanja packing' },
    { id: 5, date: '22/03/2026', category: 'Penjualan', type: 'Masuk', amount: 210000, desc: 'Transaksi Kasir' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  // Dropdown states
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showRows, setShowRows] = useState('5');
  const [modalType, setModalType] = useState('masuk');
  const [modalCategory, setModalCategory] = useState('modal');

  // Period filter state
  const [periode, setPeriode] = useState('Bulanan');
  const [dateValue, setDateValue] = useState(null);
  const handlePeriodeChange = (p) => { setPeriode(p); setDateValue(null); };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setTransactions(transactions.filter(t => t.id !== itemToDelete));
    setShowDeleteModal(false);
    setItemToDelete(null);
    
    // Show notification
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className={styles.keuanganContainer}>
      {/* Toolbar / Filters */}
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.filterGroup} style={{ border: 'none', padding: 0 }}>
            <Dropdown
              options={[
                { value: 'modal', label: 'Modal' },
                { value: 'penjualan', label: 'Penjualan' },
                { value: 'operasional', label: 'Operasional' },
                { value: 'gaji', label: 'Gaji' }
              ]}
              value={filterCategory}
              onChange={setFilterCategory}
              placeholder="Kategori"
              className="lexend-font"
            />
          </div>

          <div className={styles.filterGroup} style={{ border: 'none', padding: 0 }}>
            <Dropdown
              options={[
                { value: 'masuk', label: 'Masuk' },
                { value: 'keluar', label: 'Keluar' }
              ]}
              value={filterType}
              onChange={setFilterType}
              placeholder="Jenis"
              className="lexend-font"
            />
          </div>

          <div className={styles.filterGroup} style={{ border: 'none', padding: 0 }}>
            <PeriodeDropdown value={periode} onChange={handlePeriodeChange} />
          </div>

          <div className={styles.filterGroup} style={{ border: 'none', padding: 0 }}>
            <DateFilterBtn periode={periode} value={dateValue} onChange={setDateValue} />
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchGroup}>
            <Search size={16} className={styles.iconLeft} />
            <input 
              type="text" 
              placeholder="Cari deskripsi pengeluaran" 
              className={styles.searchInput} 
            />
          </div>
          
          <button 
            className={styles.btnAdd}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} /> Tambah Transaksi
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Kategori</th>
                <th>Jenis</th>
                <th>Nominal</th>
                <th>Keterangan</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={t.id}>
                  <td>{index + 1}</td>
                  <td>{t.date}</td>
                  <td>{t.category}</td>
                  <td>{t.type}</td>
                  <td>Rp {t.amount.toLocaleString('id-ID')}</td>
                  <td>{t.desc}</td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={`${styles.actionBtn} ${styles.edit}`}>
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className={`${styles.actionBtn} ${styles.delete}`}
                        onClick={() => handleDeleteClick(t.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className={styles.tableFooter}>
          <div className={styles.showRows}>
            <span>Show</span>
            <div style={{ position: 'relative', minWidth: '70px' }}>
              <Dropdown
                options={[
                  { value: '5', label: '5' },
                  { value: '10', label: '10' },
                  { value: '20', label: '20' }
                ]}
                value={showRows}
                onChange={setShowRows}
                className="lexend-font"
              />
            </div>
            <span>per page</span>
          </div>

          <div className={styles.pagination}>
            <span>1-{transactions.length} of 100</span>
            <button className={styles.pageNav}><ChevronLeft size={18} /></button>
            <div className={styles.pageNumbers}>
              <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
              <button className={styles.pageBtn}>2</button>
              <button className={styles.pageBtn}>3</button>
              <button className={styles.pageBtn}>4</button>
              <button className={styles.pageBtn}>5</button>
            </div>
            <button className={styles.pageNav}><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {/* Tambah Transaksi Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Tambah Transaksi</h2>
              {/* Optional close X button if needed, but screenshot 2 doesn't have it explicitly shown on top, only 'Batal' at bottom */}
            </div>

            <div className={styles.formBody}>
              <div className={styles.formGroup}>
                <label>Jenis Transaksi</label>
                <div style={{ border: 'none', padding: 0 }}>
                  <Dropdown
                    options={[
                      { value: 'masuk', label: 'Masuk' },
                      { value: 'keluar', label: 'Keluar' }
                    ]}
                    value={modalType}
                    onChange={setModalType}
                    placeholder="Pilih Jenis"
                    className="lexend-font"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Kategori</label>
                <div style={{ border: 'none', padding: 0 }}>
                  <Dropdown
                    options={[
                      { value: 'modal', label: 'Modal' },
                      { value: 'penjualan', label: 'Penjualan' },
                      { value: 'operasional', label: 'Operasional' },
                      { value: 'gaji', label: 'Gaji' }
                    ]}
                    value={modalCategory}
                    onChange={setModalCategory}
                    placeholder="Pilih Kategori"
                    className="lexend-font"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Tanggal</label>
                <div className={styles.filterGroup} style={{ width: '100%' }}>
                  <input type="text" className={styles.filterSelect} style={{ width: '100%' }} defaultValue="22/03/2026" />
                  <Calendar size={18} className={styles.iconRight} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Keterangan</label>
                <input 
                  type="text" 
                  className={styles.filterSelect} 
                  defaultValue="Mulai sesi buka toko" 
                />
              </div>

              {/* Adding Nominal just in case since it's a finance app, though screenshot might just show top half */}
              <div className={styles.formGroup}>
                <label>Nominal</label>
                <input 
                  type="number" 
                  className={styles.filterSelect} 
                  placeholder="Rp 0" 
                />
              </div>

              <div className={styles.formActions}>
                <button className={styles.btnCancel} onClick={() => setShowAddModal(false)}>Batal</button>
                <button className={styles.btnSave} onClick={() => setShowAddModal(false)}>Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '400px' }}>
            <div className={`${styles.modalHeader} ${styles.danger}`}>
              <h2 style={{ marginLeft: 0 }}>Hapus Transaksi</h2>
              <button className={styles.btnClose} onClick={() => setShowDeleteModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <p className={styles.dangerText}>
              Apakah Anda yakin ingin menghapus catatan transaksi ini?<br/>
              Data akan terhapus permanen dan hilang dari riwayat.
            </p>

            <div className={styles.formActions} style={{ marginTop: '0' }}>
              <button className={styles.btnCancel} onClick={() => setShowDeleteModal(false)}>Batal</button>
              <button className={styles.btnDelete} onClick={confirmDelete}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {showNotification && (
        <div className={styles.notification}>
          <CheckCircle size={20} />
          Sukses, Berhasil menghapus transaksi
        </div>
      )}
    </div>
  );
}
