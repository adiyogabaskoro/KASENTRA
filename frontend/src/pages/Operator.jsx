import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  X,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  ArrowDownUp
} from 'lucide-react';
import Dropdown from '../components/Dropdown';
import styles from './Operator.module.css';

export default function Operator() {
  const [operators, setOperators] = useState([
    { id: 1, name: 'Kathryn Murphy', username: 'Kathry.cash', role: 'Kasir', status: true },
    { id: 2, name: 'Theresa Webb', username: 'Resa.op', role: 'Operator', status: true },
    { id: 3, name: 'Bessie Cooper', username: 'Bessie.cash', role: 'Kasir', status: true },
    { id: 4, name: 'Ralph Edwards', username: 'Edward.cash', role: 'Kasir', status: true },
    { id: 5, name: 'Devon Lane', username: 'Devon.op', role: 'Operator', status: true },
  ]);

  const [showRows, setShowRows] = useState('5');
  const [newRole, setNewRole] = useState('Kasir');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  // States for Add Operator form
  const [addPwdShow, setAddPwdShow] = useState(false);

  // States for Password Reset form
  const [pwd1Show, setPwd1Show] = useState(false);
  const [pwd2Show, setPwd2Show] = useState(false);
  const [pwd3Show, setPwd3Show] = useState(false);

  const toggleStatus = (id) => {
    setOperators(operators.map(op => 
      op.id === id ? { ...op, status: !op.status } : op
    ));
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setOperators(operators.filter(op => op.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
    
    // Show notification
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className={styles.operatorContainer}>
      <div className={styles.headerSection}>
        <div className={styles.titleArea}>
          <UserIcon /> 
          <h2>Kelola Operator</h2>
        </div>
        <p className={styles.subtitle}>Kelola semua Akun Kasir / Operator toko disini.</p>
      </div>

      <div className={styles.toolbar}>
        <span className={styles.tableTitle}>Akun Kasir/Operator Login</span>
        
        <div className={styles.actions}>
          <div className={styles.searchGroup}>
            <Search size={16} className={styles.iconLeft} />
            <input 
              type="text" 
              placeholder="Cari Akun" 
              className={styles.searchInput} 
            />
          </div>
          
          <button 
            className={styles.btnAdd}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} /> Tambah Akun
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>
                <div className={styles.sortableHeader}>
                  Nama <ArrowDownUp size={14} />
                </div>
              </th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Password</th>
              <th>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {operators.map((op, index) => (
              <tr key={op.id}>
                <td>{index + 1}</td>
                <td>{op.name}</td>
                <td>{op.username}</td>
                <td>{op.role}</td>
                <td>
                  <div className={styles.flexCenter}>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={op.status} 
                        onChange={() => toggleStatus(op.id)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div className={styles.flexCenter}>
                    <button 
                      className={styles.actionBtn} 
                      onClick={() => setShowPasswordModal(true)}
                    >
                      <Lock size={16} />
                    </button>
                  </div>
                </td>
                <td>
                  <div className={styles.flexCenter}>
                    <button 
                      className={`${styles.actionBtn} ${styles.delete}`}
                      onClick={() => handleDeleteClick(op)}
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

      {/* Pagination Footer */}
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
          <span>1-{operators.length} of 100</span>
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

      {/* MODALS */}
      
      {/* Tambah Akun / Operator Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Tambah Operator baru</h2>
              <button className={styles.btnClose} onClick={() => setShowAddModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.formBody}>
              <div className={styles.formGroup}>
                <label>Nama</label>
                <input type="text" className={styles.inputField} defaultValue="Jenny Wilson" />
              </div>

              <div className={styles.formGroup}>
                <label>Username</label>
                <input type="text" className={styles.inputField} defaultValue="Jenny.cash" />
              </div>

              <div className={styles.formGroup}>
                <label>Password</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type={addPwdShow ? "text" : "password"} 
                    className={styles.inputField} 
                    defaultValue="*********" 
                  />
                  {addPwdShow ? (
                    <Eye className={styles.iconRight} size={18} onClick={() => setAddPwdShow(false)} />
                  ) : (
                    <EyeOff className={styles.iconRight} size={18} onClick={() => setAddPwdShow(true)} />
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Role</label>
                <div style={{ border: 'none', padding: 0 }}>
                  <Dropdown
                    options={[
                      { value: 'Kasir', label: 'Kasir' },
                      { value: 'Owner', label: 'Owner' }
                    ]}
                    value={newRole}
                    onChange={setNewRole}
                    placeholder="Pilih Role"
                    className="lexend-font"
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.btnCancel} onClick={() => setShowAddModal(false)}>Batal</button>
                <button className={styles.btnSave} onClick={() => setShowAddModal(false)}>Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ganti Password Modal */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Ganti Password</h2>
              <button className={styles.btnClose} onClick={() => setShowPasswordModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.formBody}>
              <div className={styles.formGroup}>
                <label>Password Saat Ini</label>
                <div className={styles.inputWrapper}>
                  <input type={pwd1Show ? "text" : "password"} className={styles.inputField} defaultValue="*********" />
                  {pwd1Show ? (
                    <Eye className={styles.iconRight} size={18} onClick={() => setPwd1Show(false)} />
                  ) : (
                    <EyeOff className={styles.iconRight} size={18} onClick={() => setPwd1Show(true)} />
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Password Baru</label>
                <div className={styles.inputWrapper}>
                  <input type={pwd2Show ? "text" : "password"} className={styles.inputField} defaultValue="*********" />
                  {pwd2Show ? (
                    <Eye className={styles.iconRight} size={18} onClick={() => setPwd2Show(false)} />
                  ) : (
                    <EyeOff className={styles.iconRight} size={18} onClick={() => setPwd2Show(true)} />
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Konfirmasi Password Baru</label>
                <div className={styles.inputWrapper}>
                  <input type={pwd3Show ? "text" : "password"} className={styles.inputField} defaultValue="*********" />
                  {pwd3Show ? (
                    <Eye className={styles.iconRight} size={18} onClick={() => setPwd3Show(false)} />
                  ) : (
                    <EyeOff className={styles.iconRight} size={18} onClick={() => setPwd3Show(true)} />
                  )}
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.btnCancel} onClick={() => setShowPasswordModal(false)}>Batal</button>
                <button className={styles.btnSave} onClick={() => setShowPasswordModal(false)}>Simpan</button>
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
              <h2 style={{ marginLeft: 0 }}>Hapus Akun Kasir</h2>
              <button className={styles.btnClose} onClick={() => setShowDeleteModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <p className={styles.dangerText}>
              Anda yakin akan menghapus Akun Kasir? Data akan terhapus secara permanen.
            </p>
            <div style={{ textAlign: 'center', fontWeight: '600', marginBottom: '32px' }}>
              {selectedUser?.name}
            </div>

            <div className={styles.formActions} style={{ marginTop: '0', justifyContent: 'center' }}>
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
          Sukses, Berhasil menghapus Akun Kasir
        </div>
      )}
    </div>
  );
}

// Simple User icon component since lucide User doesn't exactly match the user-outline style in screenshot exactly if we want custom styling, but let's just use an SVG wrapper
function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
