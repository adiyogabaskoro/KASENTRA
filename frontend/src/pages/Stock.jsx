// ============================================================
// KASENTRA — Stock.jsx (VERSI BARU — Terhubung ke Backend API)
//
// Perubahan dari versi lama:
//   ❌ Sebelum: data dummy array hardcoded, simpan di state saja
//   ✅ Sekarang: fetch dari API, tambah/edit/hapus ke database
// ============================================================

import { useState, useEffect } from 'react'; // ← tambah useEffect
import { 
  Search, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  X,
  CheckCircle,
  Package
} from 'lucide-react';
import Dropdown from '../components/Dropdown';
import styles from './Stock.module.css';
import { productAPI, categoryAPI } from '../services/api'; // ← IMPORT API

export default function Stock() {
  // ============================================================
  // STATE — Data dari API
  // ============================================================
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // dari API juga
  
  // State untuk loading & error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State UI (sama seperti sebelumnya)
  const [showRows, setShowRows] = useState('5');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [submitting, setSubmitting] = useState(false); // loading saat submit form

  // Form data untuk tambah produk
  const [addProductFormData, setAddProductFormData] = useState({
    name: '',
    hargaJual: '',
    idItem: '',
    tanggalExpired: '',
    hargaBeli: '',
    category: '',
    currentStock: 0,
    foto: null,           // ← file gambar
    fotoPreview: null,    // ← preview gambar di UI
  });

  // Form data untuk edit stok
  const [stockFormData, setStockFormData] = useState({
    name: '',
    hargaJual: '',
    idItem: '',
    tanggalExpired: '',
    hargaBeli: '',
    category: '',
    currentStock: 0,
    foto: null,
    fotoPreview: null,
  });

  // ============================================================
  // FETCH DATA — Dijalankan saat komponen pertama kali dibuka
  // ============================================================
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []); // [] artinya hanya dijalankan sekali saat komponen mount

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productAPI.getAll();
      // Backend mengembalikan { success: true, data: [...] }
      setProducts(response.data.data || []);
    } catch (err) {
      setError('Gagal memuat data produk. Pastikan backend berjalan.');
      console.error('Error fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data || []);
    } catch (err) {
      console.error('Error fetch categories:', err);
    }
  };

  // ============================================================
  // TAMBAH PRODUK BARU — Kirim ke API
  // ============================================================
  const handleAddProduct = async () => {
    if (!addProductFormData.name || !addProductFormData.hargaJual) {
      alert('Nama dan harga jual wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);

      // Karena ada upload foto, kita pakai FormData (bukan JSON biasa)
      const formData = new FormData();
      formData.append('name', addProductFormData.name);
      formData.append('hargaJual', addProductFormData.hargaJual);
      formData.append('idItem', addProductFormData.idItem);
      formData.append('hargaBeli', addProductFormData.hargaBeli);
      formData.append('category', addProductFormData.category);
      formData.append('stock', addProductFormData.currentStock);
      if (addProductFormData.tanggalExpired) {
        formData.append('tanggalExpired', addProductFormData.tanggalExpired);
      }
      if (addProductFormData.foto) {
        formData.append('image', addProductFormData.foto); // field 'image' sesuai backend (upload.single('image'))
      }

      await productAPI.create(formData);

      // Refresh data dari server
      await fetchProducts();

      // Reset form dan tutup modal
      setShowAddModal(false);
      setAddProductFormData({
        name: '', hargaJual: '', idItem: '', tanggalExpired: '',
        hargaBeli: '', category: '', currentStock: 0, foto: null, fotoPreview: null,
      });

      showToast('Sukses, Produk berhasil ditambahkan');
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menambah produk';
      alert('Error: ' + msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // EDIT / UPDATE STOK — Kirim ke API
  // ============================================================
  const handleSaveStock = async () => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('name', stockFormData.name);
      formData.append('hargaJual', stockFormData.hargaJual);
      formData.append('hargaBeli', stockFormData.hargaBeli);
      formData.append('category', stockFormData.category);
      formData.append('stock', stockFormData.currentStock);
      if (stockFormData.tanggalExpired) {
        formData.append('tanggalExpired', stockFormData.tanggalExpired);
      }
      if (stockFormData.foto) {
        formData.append('image', stockFormData.foto); // field 'image' sesuai backend
      }

      await productAPI.update(selectedProduct._id, formData);

      await fetchProducts();
      setShowStockModal(false);
      setSelectedProduct(null);
      showToast('Sukses, Stok berhasil diperbarui');
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal memperbarui stok';
      alert('Error: ' + msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // HAPUS PRODUK — Kirim ke API
  // ============================================================
  const confirmDelete = async () => {
    try {
      setSubmitting(true);
      await productAPI.delete(selectedProduct._id);
      await fetchProducts();
      setShowDeleteModal(false);
      setSelectedProduct(null);
      showToast('Sukses, Produk berhasil dihapus');
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menghapus produk';
      alert('Error: ' + msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================
  const showToast = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleStockIncrease = (product) => {
    setSelectedProduct(product);
    setStockFormData({
      name: product.name || product.nama || '',
      hargaJual: product.hargaJual?.toString() || '',
      idItem: product.idItem || '',
      tanggalExpired: product.tanggalExpired ? product.tanggalExpired.substring(0, 10) : '',
      hargaBeli: product.hargaBeli?.toString() || '',
      category: product.category?._id || product.category || product.kategori || '',
      currentStock: product.stock ?? product.stok ?? 0,
      foto: null,
      fotoPreview: product.image || product.foto || null,
    });
    setShowStockModal(true);
  };

  const formatPrice = (price) => `Rp${Number(price || 0).toLocaleString('id-ID')}`;

  // Filter & pagination (sama seperti sebelumnya, sesuaikan field nama)
  const getFilteredProducts = () => {
    let filtered = products;
    const stokField = (p) => p.stok ?? p.stock ?? 0;

    if (activeFilter === 'safe') filtered = filtered.filter(p => stokField(p) >= 100);
    else if (activeFilter === 'warning') filtered = filtered.filter(p => stokField(p) >= 50 && stokField(p) < 100);
    else if (activeFilter === 'danger') filtered = filtered.filter(p => stokField(p) < 50);

    if (searchQuery) {
      filtered = filtered.filter(p =>
        (p.nama || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.kategori || p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  const stokField = (p) => p.stok ?? p.stock ?? 0;
  const categoryStats = {
    'Stok Aman': products.filter(p => stokField(p) >= 100).length,
    'Stok Menipis': products.filter(p => stokField(p) >= 50 && stokField(p) < 100).length,
    'Stok Habis': products.filter(p => stokField(p) < 50).length,
  };

  const itemsPerPage = parseInt(showRows);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterClick = (filter) => {
    setActiveFilter(activeFilter === filter ? 'all' : filter);
    setCurrentPage(1);
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className={styles.stockContainer}>
      <div className={styles.headerSection}>
        <div className={styles.titleArea}>
          <Package size={24} />
          <h2>Kelola Inventory</h2>
        </div>
      </div>

      {/* ✅ Tampilkan error jika gagal fetch */}
      {error && (
        <div style={{
          background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px',
          padding: '12px 16px', marginBottom: '16px', color: '#dc2626',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          ⚠️ {error}
          <button onClick={fetchProducts} style={{ marginLeft: 'auto', textDecoration: 'underline', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
            Coba lagi
          </button>
        </div>
      )}

      {/* Category Stats */}
      <div className={styles.statsRow}>
        {[
          { key: 'safe', label: 'Stok Aman', icon: '✓', count: categoryStats['Stok Aman'] },
          { key: 'warning', label: 'Stok Menipis', icon: '⚠', count: categoryStats['Stok Menipis'] },
          { key: 'danger', label: 'Stok Habis', icon: '✕', count: categoryStats['Stok Habis'] },
        ].map(({ key, label, icon, count }) => (
          <div
            key={key}
            className={`${styles.statCard} ${styles[key]} ${activeFilter === key ? styles.activeCard : ''}`}
            onClick={() => handleFilterClick(key)}
          >
            <div className={styles.statIcon}>{icon}</div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>{label}</span>
              <span className={styles.statValue}>{count} Item</span>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchGroup}>
          <Search size={16} className={styles.iconLeft} />
          <input
            type="text"
            placeholder="Cari Produk"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className={styles.btnAdd} onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Tambah Produk
        </button>
      </div>

      {/* ✅ Tampilkan loading spinner */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          ⏳ Memuat data produk...
        </div>
      ) : (
        /* Table */
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Item</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                    {searchQuery ? 'Produk tidak ditemukan' : 'Belum ada produk. Klik "Tambah Produk" untuk mulai.'}
                  </td>
                </tr>
              ) : (
                currentProducts.map((product, index) => (
                  <tr key={product._id || product.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* ✅ Tampilkan foto dari Cloudinary */}
                        {(product.image || product.foto) && (
                          <img
                            src={product.image || product.foto}
                            alt={product.name || product.nama}
                            style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                          />
                        )}
                        {product.name || product.nama}
                      </div>
                    </td>
                    <td>{typeof product.category === "object" ? product.category?.name : (product.kategori || product.category || "-")}</td>
                    <td>{formatPrice(product.hargaJual || product.price)}</td>
                    <td>{stokField(product)}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={`${styles.actionBtn} ${styles.delete}`}
                          onClick={() => handleDeleteClick(product)}
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.add}`}
                          onClick={() => handleStockIncrease(product)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && (
        <div className={styles.tableFooter}>
          <div className={styles.showRows}>
            <span>Show</span>
            <Dropdown
              options={[{ value: '5', label: '5' }, { value: '10', label: '10' }, { value: '20', label: '20' }]}
              value={showRows}
              onChange={(v) => { setShowRows(v); setCurrentPage(1); }}
            />
            <span>per page</span>
          </div>
          <div className={styles.pagination}>
            <span>{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length}</span>
            <button className={styles.pageNav} onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
              <button key={p} className={`${styles.pageBtn} ${currentPage === p ? styles.active : ''}`} onClick={() => setCurrentPage(p)}>
                {p}
              </button>
            ))}
            <button className={styles.pageNav} onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL — Tambah Produk Baru
      ============================================================ */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '800px' }}>
            <div className={styles.modalHeader}>
              <h2>Tambah Produk Baru</h2>
              <button className={styles.btnClose} onClick={() => setShowAddModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.formBody}>
              <div className={styles.stockModalGrid}>
                {/* Kiri: Upload foto */}
                <div className={styles.imageSection}>
                  <div className={styles.imageUploadBox}>
                    {addProductFormData.fotoPreview ? (
                      <img src={addProductFormData.fotoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      <X size={48} className={styles.placeholderIcon} />
                    )}
                  </div>
                  {/* ✅ Input file yang benar untuk upload ke Cloudinary */}
                  <label className={styles.btnUpload} style={{ cursor: 'pointer' }}>
                    📷 Ubah Foto
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setAddProductFormData({
                            ...addProductFormData,
                            foto: file,
                            fotoPreview: URL.createObjectURL(file),
                          });
                        }
                      }}
                    />
                  </label>
                  <div className={styles.currentStock}>
                    <span className={styles.stockLabel}>Stok saat ini</span>
                    <span className={styles.stockNumber}>{addProductFormData.currentStock}</span>
                  </div>
                  <button
                    className={styles.btnAddStock}
                    onClick={() => setAddProductFormData(p => ({ ...p, currentStock: p.currentStock + 1 }))}
                  >
                    <Plus size={16} /> Tambah Stok
                  </button>
                </div>

                {/* Kanan: Form fields */}
                <div className={styles.formSection}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Nama Item</label>
                      <input type="text" className={styles.inputField} placeholder="Masukkan nama"
                        value={addProductFormData.name}
                        onChange={(e) => setAddProductFormData(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Harga Jual</label>
                      <input type="number" className={styles.inputField} placeholder="Masukkan harga jual"
                        value={addProductFormData.hargaJual}
                        onChange={(e) => setAddProductFormData(p => ({ ...p, hargaJual: e.target.value }))} />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>ID Item</label>
                      <input type="text" className={styles.inputField} placeholder="Masukkan ID"
                        value={addProductFormData.idItem}
                        onChange={(e) => setAddProductFormData(p => ({ ...p, idItem: e.target.value }))} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Tanggal Expired</label>
                      <input type="date" className={styles.inputField}
                        value={addProductFormData.tanggalExpired}
                        onChange={(e) => setAddProductFormData(p => ({ ...p, tanggalExpired: e.target.value }))} />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Harga Beli</label>
                      <input type="number" className={styles.inputField} placeholder="Masukkan harga beli"
                        value={addProductFormData.hargaBeli}
                        onChange={(e) => setAddProductFormData(p => ({ ...p, hargaBeli: e.target.value }))} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Kategori</label>
                      <Dropdown
                        options={categories.length > 0
                          ? categories.map(c => ({ value: c._id, label: c.nama || c.name }))
                          : [{ value: 'Makanan', label: 'Makanan' }, { value: 'Minuman', label: 'Minuman' }]
                        }
                        value={addProductFormData.category}
                        onChange={(val) => setAddProductFormData(p => ({ ...p, category: val }))}
                        placeholder="Pilih Kategori"
                      />
                    </div>
                  </div>
                  <div className={styles.stockModalActions}>
                    <div />
                    <div className={styles.actionButtons}>
                      <button className={styles.btnCancel} onClick={() => setShowAddModal(false)}>Batal</button>
                      <button className={styles.btnSave} onClick={handleAddProduct} disabled={submitting}>
                        {submitting ? '⏳ Menyimpan...' : 'Simpan'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL — Update Stok
      ============================================================ */}
      {showStockModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '800px' }}>
            <div className={styles.modalHeader}>
              <h2>Tambah Stok</h2>
              <button className={styles.btnClose} onClick={() => setShowStockModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.formBody}>
              <div className={styles.stockModalGrid}>
                <div className={styles.imageSection}>
                  <div className={styles.imageUploadBox}>
                    {stockFormData.fotoPreview ? (
                      <img src={stockFormData.fotoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      <X size={48} className={styles.placeholderIcon} />
                    )}
                  </div>
                  <label className={styles.btnUpload} style={{ cursor: 'pointer' }}>
                    📷 Ubah Foto
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) setStockFormData(p => ({ ...p, foto: file, fotoPreview: URL.createObjectURL(file) }));
                      }} />
                  </label>
                  <div className={styles.currentStock}>
                    <span className={styles.stockLabel}>Stok saat ini</span>
                    <span className={styles.stockNumber}>{stockFormData.currentStock}</span>
                  </div>
                  <button className={styles.btnAddStock} onClick={() => setStockFormData(p => ({ ...p, currentStock: p.currentStock + 1 }))}>
                    <Plus size={16} /> Tambah Stok
                  </button>
                </div>
                <div className={styles.formSection}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Nama Item</label>
                      <input type="text" className={styles.inputField} value={stockFormData.name}
                        onChange={(e) => setStockFormData(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Harga Jual</label>
                      <input type="number" className={styles.inputField} value={stockFormData.hargaJual}
                        onChange={(e) => setStockFormData(p => ({ ...p, hargaJual: e.target.value }))} />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>ID Item</label>
                      <input type="text" className={styles.inputField} value={stockFormData.idItem} readOnly />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Tanggal Expired</label>
                      <input type="date" className={styles.inputField} value={stockFormData.tanggalExpired}
                        onChange={(e) => setStockFormData(p => ({ ...p, tanggalExpired: e.target.value }))} />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Harga Beli</label>
                      <input type="number" className={styles.inputField} value={stockFormData.hargaBeli}
                        onChange={(e) => setStockFormData(p => ({ ...p, hargaBeli: e.target.value }))} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Kategori</label>
                      <input type="text" className={styles.inputField} value={stockFormData.category}
                        onChange={(e) => setStockFormData(p => ({ ...p, category: e.target.value }))} />
                    </div>
                  </div>
                  <div className={styles.stockModalActions}>
                    <button className={styles.btnDeleteItem} onClick={() => { setShowStockModal(false); handleDeleteClick(selectedProduct); }}>
                      <Trash2 size={16} />
                    </button>
                    <div className={styles.actionButtons}>
                      <button className={styles.btnCancel} onClick={() => setShowStockModal(false)}>Batal</button>
                      <button className={styles.btnSave} onClick={handleSaveStock} disabled={submitting}>
                        {submitting ? '⏳ Menyimpan...' : 'Simpan'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL — Konfirmasi Hapus
      ============================================================ */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '500px' }}>
            <div className={styles.deleteModalBody}>
              <div className={styles.deleteImageBox}>
                {selectedProduct?.foto ? (
                  <img src={selectedProduct.foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                ) : (
                  <X size={48} className={styles.placeholderIcon} />
                )}
              </div>
              <div className={styles.deleteFormFields}>
                <div className={styles.formGroup}>
                  <label>Nama Item</label>
                  <input type="text" className={styles.inputField} value={selectedProduct?.nama || selectedProduct?.name} readOnly />
                </div>
                <div className={styles.formGroup}>
                  <label>ID Item</label>
                  <input type="text" className={styles.inputField} value={selectedProduct?.idItem || selectedProduct?._id?.substring(0, 8)} readOnly />
                </div>
              </div>
              <div className={styles.deleteActions}>
                <button className={styles.btnCancelDelete} onClick={() => setShowDeleteModal(false)}>Batal</button>
                <button className={styles.btnConfirmDelete} onClick={confirmDelete} disabled={submitting}>
                  {submitting ? '⏳ Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showNotification && (
        <div className={styles.notification}>
          <CheckCircle size={20} />
          {notificationMessage}
        </div>
      )}
    </div>
  );
}
