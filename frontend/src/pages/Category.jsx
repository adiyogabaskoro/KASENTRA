import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit2,
  ChevronLeft, 
  ChevronRight,
  X,
  CheckCircle,
  Tag
} from 'lucide-react';
import Dropdown from '../components/Dropdown';
import styles from './Category.module.css';

export default function Category() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Makanan', itemCount: 15, description: 'Produk makanan dan snack' },
    { id: 2, name: 'Minuman', itemCount: 12, description: 'Minuman dingin dan panas' },
    { id: 3, name: 'Alat Tulis', itemCount: 8, description: 'Perlengkapan tulis menulis' },
    { id: 4, name: 'Elektronik', itemCount: 5, description: 'Barang elektronik' },
  ]);

  const [showRows, setShowRows] = useState('5');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setShowEditModal(true);
  };

  const confirmDelete = () => {
    setCategories(categories.filter(c => c.id !== selectedCategory.id));
    setShowDeleteModal(false);
    setSelectedCategory(null);
    
    setNotificationMessage('Sukses, Kategori berhasil dihapus');
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleAddCategory = () => {
    const newId = Math.max(...categories.map(c => c.id)) + 1;
    setCategories([...categories, { 
      id: newId, 
      name: formData.name,
      description: formData.description,
      itemCount: 0
    }]);
    setShowAddModal(false);
    setFormData({ name: '', description: '' });
    
    setNotificationMessage('Sukses, Kategori berhasil ditambahkan');
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleEditCategory = () => {
    setCategories(categories.map(c => 
      c.id === selectedCategory.id 
        ? { ...c, name: formData.name, description: formData.description }
        : c
    ));
    setShowEditModal(false);
    setSelectedCategory(null);
    setFormData({ name: '', description: '' });
    
    setNotificationMessage('Sukses, Kategori berhasil diperbarui');
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.categoryContainer}>
      <div className={styles.headerSection}>
        <div className={styles.titleArea}>
          <Tag size={24} />
          <h2>Kelola Kategori</h2>
        </div>
        <p className={styles.subtitle}>Kelola semua kategori produk toko disini.</p>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <span className={styles.tableTitle}>Daftar Kategori Produk</span>
        
        <div className={styles.actions}>
          <div className={styles.searchGroup}>
            <Search size={16} className={styles.iconLeft} />
            <input 
              type="text" 
              placeholder="Cari Kategori" 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button 
            className={styles.btnAdd}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} /> Tambah Kategori
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Kategori</th>
              <th>Deskripsi</th>
              <th>Jumlah Item</th>
              <th>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category, index) => (
              <tr key={category.id}>
                <td>{index + 1}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>{category.itemCount} Item</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button 
                      className={`${styles.actionBtn} ${styles.edit}`}
                      onClick={() => handleEditClick(category)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${styles.delete}`}
                      onClick={() => handleDeleteClick(category)}
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
          <span>1-{filteredCategories.length} of {categories.length}</span>
          <button className={styles.pageNav}><ChevronLeft size={18} /></button>
          <div className={styles.pageNumbers}>
            <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
            <button className={styles.pageBtn}>2</button>
            <button className={styles.pageBtn}>3</button>
          </div>
          <button className={styles.pageNav}><ChevronRight size={18} /></button>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Tambah Kategori Baru</h2>
              <button className={styles.btnClose} onClick={() => setShowAddModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.formBody}>
              <div className={styles.formGroup}>
                <label>Nama Kategori</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Masukkan nama kategori"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Deskripsi</label>
                <textarea 
                  className={styles.textareaField}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Masukkan deskripsi kategori"
                  rows="4"
                />
              </div>

              <div className={styles.formActions}>
                <button className={styles.btnCancel} onClick={() => setShowAddModal(false)}>Batal</button>
                <button className={styles.btnSave} onClick={handleAddCategory}>Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Kategori</h2>
              <button className={styles.btnClose} onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.formBody}>
              <div className={styles.formGroup}>
                <label>Nama Kategori</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Masukkan nama kategori"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Deskripsi</label>
                <textarea 
                  className={styles.textareaField}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Masukkan deskripsi kategori"
                  rows="4"
                />
              </div>

              <div className={styles.formActions}>
                <button className={styles.btnCancel} onClick={() => setShowEditModal(false)}>Batal</button>
                <button className={styles.btnSave} onClick={handleEditCategory}>Simpan</button>
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
              <h2 style={{ marginLeft: 0 }}>Hapus Kategori</h2>
              <button className={styles.btnClose} onClick={() => setShowDeleteModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <p className={styles.dangerText}>
              Anda yakin akan menghapus kategori ini? Data akan terhapus secara permanen.
            </p>
            <div style={{ textAlign: 'center', fontWeight: '600', marginBottom: '32px' }}>
              {selectedCategory?.name}
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
          {notificationMessage}
        </div>
      )}
    </div>
  );
}
