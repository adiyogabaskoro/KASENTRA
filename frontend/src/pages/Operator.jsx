import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, ChevronLeft, ChevronRight, X, CheckCircle, Lock, Eye, EyeOff, ArrowDownUp, Users } from 'lucide-react';
import Dropdown from '../components/Dropdown';
import styles from './Operator.module.css';
import { userAPI } from '../services/api';

export default function Operator() {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showRows, setShowRows] = useState('5');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [newRole, setNewRole] = useState('kasir');
  const [addPwdShow, setAddPwdShow] = useState(false);
  const [newPwdShow, setNewPwdShow] = useState(false);
  const [confirmPwdShow, setConfirmPwdShow] = useState(false);

  const [addForm, setAddForm] = useState({ name: '', username: '', password: '', role: 'kasir' });
  const [pwdForm, setPwdForm] = useState({ newPassword: '', confirmPassword: '' });

  useEffect(() => { fetchOperators(); }, []);

  const fetchOperators = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await userAPI.getAll();
      setOperators(res.data.data || []);
    } catch (err) {
      setError('Gagal memuat data akun.');
    } finally { setLoading(false); }
  };

  const showToast = (msg) => {
    setNotificationMessage(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const toggleStatus = async (user) => {
    try {
      await userAPI.toggleStatus(user._id);
      await fetchOperators();
    } catch (err) {
      alert('Gagal mengubah status');
    }
  };

  const handleAddUser = async () => {
    if (!addForm.name || !addForm.username || !addForm.password) return alert('Semua field wajib diisi!');
    try {
      setSubmitting(true);
      await userAPI.create(addForm);
      await fetchOperators();
      setShowAddModal(false);
      setAddForm({ name: '', username: '', password: '', role: 'kasir' });
      showToast('Sukses, Akun berhasil ditambahkan');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menambah akun');
    } finally { setSubmitting(false); }
  };

  const confirmDelete = async () => {
    try {
      setSubmitting(true);
      await userAPI.delete(selectedUser._id);
      await fetchOperators();
      setShowDeleteModal(false);
      setSelectedUser(null);
      showToast('Sukses, Akun berhasil dihapus');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus akun');
    } finally { setSubmitting(false); }
  };

  const handleResetPassword = async () => {
    if (!pwdForm.newPassword || pwdForm.newPassword !== pwdForm.confirmPassword) {
      return alert('Password baru tidak cocok!');
    }
    try {
      setSubmitting(true);
      await userAPI.update(selectedUser._id, { password: pwdForm.newPassword });
      setShowPasswordModal(false);
      setPwdForm({ newPassword: '', confirmPassword: '' });
      showToast('Sukses, Password berhasil diperbarui');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal reset password');
    } finally { setSubmitting(false); }
  };

  const filtered = operators.filter(op =>
    (op.nama || op.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (op.username || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const itemsPerPage = parseInt(showRows);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const current = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={styles.operatorContainer}>
      <div className={styles.headerSection}>
        <div className={styles.titleArea}>
          <Users size={24} />
          <h2>Kelola Operator</h2>
        </div>
        <p className={styles.subtitle}>Kelola semua Akun Kasir / Operator toko disini.</p>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: '#dc2626' }}>
          ⚠️ {error}
          <button onClick={fetchOperators} style={{ marginLeft: '8px', textDecoration: 'underline', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>Coba lagi</button>
        </div>
      )}

      <div className={styles.toolbar}>
        <span className={styles.tableTitle}>Akun Kasir/Operator Login</span>
        <div className={styles.actions}>
          <div className={styles.searchGroup}>
            <Search size={16} className={styles.iconLeft} />
            <input type="text" placeholder="Cari Akun" className={styles.searchInput} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className={styles.btnAdd} onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Tambah Akun
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>⏳ Memuat data...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th><div className={styles.sortableHeader}>Nama <ArrowDownUp size={14} /></div></th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Password</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {current.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>Belum ada akun.</td></tr>
              ) : current.map((op, i) => (
                <tr key={op._id}>
                  <td>{startIndex + i + 1}</td>
                  <td>{op.nama || op.name}</td>
                  <td>{op.username}</td>
                  <td style={{ textTransform: 'capitalize' }}>{op.role}</td>
                  <td>
                    <div className={styles.flexCenter}>
                      <label className={styles.switch}>
                        <input type="checkbox" checked={op.status !== false} onChange={() => toggleStatus(op)} />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                  </td>
                  <td>
                    <div className={styles.flexCenter}>
                      <button className={styles.actionBtn} onClick={() => { setSelectedUser(op); setShowPasswordModal(true); }}>
                        <Lock size={16} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className={styles.flexCenter}>
                      <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => { setSelectedUser(op); setShowDeleteModal(true); }}>
                        <Trash2 size={16} />
                      </button>
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
              <h2>Tambah Akun Baru</h2>
              <button className={styles.btnClose} onClick={() => setShowAddModal(false)}><X size={24} /></button>
            </div>
            <div className={styles.formBody}>
              <div className={styles.formGroup}>
                <label>Nama Lengkap</label>
                <input type="text" className={styles.inputField} value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} placeholder="Masukkan nama lengkap" />
              </div>
              <div className={styles.formGroup}>
                <label>Username</label>
                <input type="text" className={styles.inputField} value={addForm.username} onChange={e => setAddForm(p => ({ ...p, username: e.target.value }))} placeholder="Masukkan username" />
              </div>
              <div className={styles.formGroup}>
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={addPwdShow ? 'text' : 'password'} className={styles.inputField} value={addForm.password} onChange={e => setAddForm(p => ({ ...p, password: e.target.value }))} placeholder="Masukkan password" style={{ paddingRight: '40px' }} />
                  <span onClick={() => setAddPwdShow(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6b7280' }}>
                    {addPwdShow ? <Eye size={18} /> : <EyeOff size={18} />}
                  </span>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Role</label>
                <Dropdown
                  options={[{ value: 'kasir', label: 'Kasir' }, { value: 'operator', label: 'Operator' }]}
                  value={addForm.role}
                  onChange={v => setAddForm(p => ({ ...p, role: v }))}
                  placeholder="Pilih Role"
                />
              </div>
              <div className={styles.formActions}>
                <button className={styles.btnCancel} onClick={() => setShowAddModal(false)}>Batal</button>
                <button className={styles.btnSave} onClick={handleAddUser} disabled={submitting}>{submitting ? '⏳ Menyimpan...' : 'Simpan'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Reset Password — {selectedUser?.nama}</h2>
              <button className={styles.btnClose} onClick={() => setShowPasswordModal(false)}><X size={24} /></button>
            </div>
            <div className={styles.formBody}>
              <div className={styles.formGroup}>
                <label>Password Baru</label>
                <div style={{ position: 'relative' }}>
                  <input type={newPwdShow ? 'text' : 'password'} className={styles.inputField} value={pwdForm.newPassword} onChange={e => setPwdForm(p => ({ ...p, newPassword: e.target.value }))} placeholder="Masukkan password baru" style={{ paddingRight: '40px' }} />
                  <span onClick={() => setNewPwdShow(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6b7280' }}>
                    {newPwdShow ? <Eye size={18} /> : <EyeOff size={18} />}
                  </span>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Konfirmasi Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={confirmPwdShow ? 'text' : 'password'} className={styles.inputField} value={pwdForm.confirmPassword} onChange={e => setPwdForm(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="Ulangi password baru" style={{ paddingRight: '40px' }} />
                  <span onClick={() => setConfirmPwdShow(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6b7280' }}>
                    {confirmPwdShow ? <Eye size={18} /> : <EyeOff size={18} />}
                  </span>
                </div>
              </div>
              <div className={styles.formActions}>
                <button className={styles.btnCancel} onClick={() => setShowPasswordModal(false)}>Batal</button>
                <button className={styles.btnSave} onClick={handleResetPassword} disabled={submitting}>{submitting ? '⏳...' : 'Simpan'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '400px' }}>
            <div className={styles.modalHeader}>
              <h2>Hapus Akun</h2>
              <button className={styles.btnClose} onClick={() => setShowDeleteModal(false)}><X size={24} /></button>
            </div>
            <p style={{ padding: '16px', color: '#6b7280' }}>Yakin ingin menghapus akun <strong>{selectedUser?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
            <div className={styles.formActions} style={{ padding: '0 16px 16px' }}>
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
