import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  X,
  CheckCircle,
  ChevronDown,
  Package
} from 'lucide-react';
import Dropdown from '../components/Dropdown';
import styles from './Stock.module.css';

export default function Stock() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Produk 1', category: 'Makanan', price: 30000, stock: 200 },
    { id: 2, name: 'Produk 2', category: 'Minuman', price: 10000, stock: 150 },
    { id: 3, name: 'Produk 3', category: 'Makanan', price: 5000, stock: 20 },
    { id: 4, name: 'Produk 4', category: 'Makanan', price: 35000, stock: 49 },
    { id: 5, name: 'Produk 5', category: 'Minuman', price: 5000, stock: 66 },
  ]);

  const [showRows, setShowRows] = useState('5');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'safe', 'warning', 'danger'
  const [currentPage, setCurrentPage] = useState(1);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [stockToAdd, setStockToAdd] = useState('');
  
  // Stock modal form data
  const [stockFormData, setStockFormData] = useState({
    name: '',
    hargaJual: '',
    idItem: '',
    tanggalExpired: '',
    hargaBeli: '',
    category: '',
    currentStock: 0
  });

  // Form states for Add/Edit Product
  const [formData, setFormData] = useState({
    name: '',
    category: 'Makanan',
    price: '',
    stock: ''
  });
  
  // Add Product modal form data (same as stock modal)
  const [addProductFormData, setAddProductFormData] = useState({
    name: '',
    hargaJual: '',
    idItem: '',
    tanggalExpired: '',
    hargaBeli: '',
    category: 'Makanan',
    currentStock: 0
  });

  // Calculate category counts
  const categoryStats = {
    'Stok Aman': products.filter(p => p.stock >= 100).length,
    'Stok Menipis': products.filter(p => p.stock >= 50 && p.stock < 100).length,
    'Stok Habis': products.filter(p => p.stock < 50).length,
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString()
    });
    setShowEditModal(true);
  };

  const confirmDelete = () => {
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setShowDeleteModal(false);
    setSelectedProduct(null);
    
    setNotificationMessage('Sukses, Produk berhasil dihapus');
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleAddProduct = () => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    setProducts([...products, { 
      id: newId, 
      name: addProductFormData.name,
      category: addProductFormData.category,
      price: parseInt(addProductFormData.hargaJual) || 0,
      stock: addProductFormData.currentStock
    }]);
    setShowAddModal(false);
    setAddProductFormData({ 
      name: '', 
      hargaJual: '', 
      idItem: '',
      tanggalExpired: '',
      hargaBeli: '',
      category: 'Makanan', 
      currentStock: 0 
    });
    
    setNotificationMessage('Sukses, Produk berhasil ditambahkan');
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleAddProductStockClick = () => {
    const newStock = addProductFormData.currentStock + 1;
    setAddProductFormData({
      ...addProductFormData,
      currentStock: newStock
    });
  };

  const handleEditProduct = () => {
    setProducts(products.map(p => 
      p.id === selectedProduct.id 
        ? { 
            ...p, 
            name: formData.name,
            category: formData.category,
            price: parseInt(formData.price),
            stock: parseInt(formData.stock)
          }
        : p
    ));
    setShowEditModal(false);
    setSelectedProduct(null);
    setFormData({ name: '', category: 'Makanan', price: '', stock: '' });
    
    setNotificationMessage('Sukses, Produk berhasil diperbarui');
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleStockIncrease = (product) => {
    setSelectedProduct(product);
    setStockFormData({
      name: product.name,
      hargaJual: product.price.toString(),
      idItem: `ITEM-${product.id}`,
      tanggalExpired: '',
      hargaBeli: '',
      category: product.category,
      currentStock: product.stock
    });
    setShowStockModal(true);
  };

  const handleAddStockClick = () => {
    const newStock = stockFormData.currentStock + 1;
    setStockFormData({
      ...stockFormData,
      currentStock: newStock
    });
  };

  const handleSaveStock = () => {
    setProducts(products.map(p => 
      p.id === selectedProduct.id 
        ? { 
            ...p, 
            name: stockFormData.name,
            price: parseInt(stockFormData.hargaJual),
            category: stockFormData.category,
            stock: stockFormData.currentStock
          } 
        : p
    ));
    setShowStockModal(false);
    setSelectedProduct(null);
    
    setNotificationMessage('Sukses, Stok berhasil diperbarui');
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const formatPrice = (price) => {
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  // Filter products based on active filter and search query
  const getFilteredProducts = () => {
    let filtered = products;

    // Apply stock filter
    if (activeFilter === 'safe') {
      filtered = filtered.filter(p => p.stock >= 100);
    } else if (activeFilter === 'warning') {
      filtered = filtered.filter(p => p.stock >= 50 && p.stock < 100);
    } else if (activeFilter === 'danger') {
      filtered = filtered.filter(p => p.stock < 50);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const handleFilterClick = (filter) => {
    setActiveFilter(activeFilter === filter ? 'all' : filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Pagination logic
  const itemsPerPage = parseInt(showRows);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsChange = (value) => {
    setShowRows(value);
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  return (
    <div className={styles.stockContainer}>
      <div className={styles.headerSection}>
        <div className={styles.titleArea}>
          <Package size={24} />
          <h2>Kelola Inventory</h2>
        </div>
      </div>

      {/* Category Stats */}
      <div className={styles.statsRow}>
        <div 
          className={`${styles.statCard} ${styles.safe} ${activeFilter === 'safe' ? styles.activeCard : ''}`}
          onClick={() => handleFilterClick('safe')}
        >
          <div className={styles.statIcon}>✓</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Stok Aman</span>
            <span className={styles.statValue}>{categoryStats['Stok Aman']} Item</span>
          </div>
        </div>
        
        <div 
          className={`${styles.statCard} ${styles.warning} ${activeFilter === 'warning' ? styles.activeCard : ''}`}
          onClick={() => handleFilterClick('warning')}
        >
          <div className={styles.statIcon}>⚠</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Stok Menipis</span>
            <span className={styles.statValue}>{categoryStats['Stok Menipis']} Item</span>
          </div>
        </div>
        
        <div 
          className={`${styles.statCard} ${styles.danger} ${activeFilter === 'danger' ? styles.activeCard : ''}`}
          onClick={() => handleFilterClick('danger')}
        >
          <div className={styles.statIcon}>✕</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Stok Habis</span>
            <span className={styles.statValue}>{categoryStats['Stok Habis']} Item</span>
          </div>
        </div>
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
        
        <button 
          className={styles.btnAdd}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} /> Tambah Produk
        </button>
      </div>

      {/* Table */}
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
            {currentProducts.map((product, index) => (
              <tr key={product.id}>
                <td>{startIndex + index + 1}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{formatPrice(product.price)}</td>
                <td>{product.stock}</td>
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
              onChange={handleRowsChange}
              className="lexend-font"
            />
          </div>
          <span>per page</span>
        </div>

        <div className={styles.pagination}>
          <span>{startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}</span>
          <button 
            className={styles.pageNav}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
          </button>
          <div className={styles.pageNumbers}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button 
                  key={pageNum}
                  className={`${styles.pageBtn} ${currentPage === pageNum ? styles.active : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button 
            className={styles.pageNav}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Add Product Modal */}
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
                {/* Left side - Image upload */}
                <div className={styles.imageSection}>
                  <div className={styles.imageUploadBox}>
                    <X size={48} className={styles.placeholderIcon} />
                  </div>
                  <button className={styles.btnUpload}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Ubah Foto
                  </button>
                  
                  <div className={styles.currentStock}>
                    <span className={styles.stockLabel}>Stok saat ini</span>
                    <span className={styles.stockNumber}>{addProductFormData.currentStock}</span>
                  </div>
                  
                  <button 
                    className={styles.btnAddStock}
                    onClick={handleAddProductStockClick}
                  >
                    <Plus size={16} />
                    Tambah Stok
                  </button>
                </div>

                {/* Right side - Form fields */}
                <div className={styles.formSection}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Nama Item</label>
                      <input 
                        type="text" 
                        className={styles.inputField}
                        value={addProductFormData.name}
                        onChange={(e) => setAddProductFormData({...addProductFormData, name: e.target.value})}
                        placeholder="Masukkan nama"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Harga Jual</label>
                      <input 
                        type="number" 
                        className={styles.inputField}
                        value={addProductFormData.hargaJual}
                        onChange={(e) => setAddProductFormData({...addProductFormData, hargaJual: e.target.value})}
                        placeholder="Masukkan harga jual"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>ID Item</label>
                      <input 
                        type="text" 
                        className={styles.inputField}
                        value={addProductFormData.idItem}
                        onChange={(e) => setAddProductFormData({...addProductFormData, idItem: e.target.value})}
                        placeholder="Masukkan ID"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Tanggal Expired</label>
                      <input 
                        type="date" 
                        className={styles.inputField}
                        value={addProductFormData.tanggalExpired}
                        onChange={(e) => setAddProductFormData({...addProductFormData, tanggalExpired: e.target.value})}
                        placeholder="Masukkan tanggal expired"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Harga Beli</label>
                      <input 
                        type="number" 
                        className={styles.inputField}
                        value={addProductFormData.hargaBeli}
                        onChange={(e) => setAddProductFormData({...addProductFormData, hargaBeli: e.target.value})}
                        placeholder="Masukkan harga beli"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Kategori</label>
                      <div style={{ border: 'none', padding: 0 }}>
                        <Dropdown
                          options={[
                            { value: 'Makanan', label: 'Makanan' },
                            { value: 'Minuman', label: 'Minuman' }
                          ]}
                          value={addProductFormData.category}
                          onChange={(val) => setAddProductFormData({...addProductFormData, category: val})}
                          placeholder="Pilih Kategori"
                          className="lexend-font"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.stockModalActions}>
                    <div></div>
                    <div className={styles.actionButtons}>
                      <button 
                        className={styles.btnCancel} 
                        onClick={() => setShowAddModal(false)}
                      >
                        Batal
                      </button>
                      <button 
                        className={styles.btnSave} 
                        onClick={handleAddProduct}
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Produk</h2>
              <button className={styles.btnClose} onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.formBody}>
              <div className={styles.formGroup}>
                <label>Nama Produk</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Masukkan nama produk"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Kategori</label>
                <div style={{ border: 'none', padding: 0 }}>
                  <Dropdown
                    options={[
                      { value: 'Makanan', label: 'Makanan' },
                      { value: 'Minuman', label: 'Minuman' }
                    ]}
                    value={formData.category}
                    onChange={(val) => setFormData({...formData, category: val})}
                    placeholder="Pilih Kategori"
                    className="lexend-font"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Harga</label>
                <input 
                  type="number" 
                  className={styles.inputField}
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="Masukkan harga"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Stok</label>
                <input 
                  type="number" 
                  className={styles.inputField}
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  placeholder="Masukkan jumlah stok"
                />
              </div>

              <div className={styles.formActions}>
                <button className={styles.btnCancel} onClick={() => setShowEditModal(false)}>Batal</button>
                <button className={styles.btnSave} onClick={handleEditProduct}>Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tambah Stok Modal */}
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
                {/* Left side - Image upload */}
                <div className={styles.imageSection}>
                  <div className={styles.imageUploadBox}>
                    <X size={48} className={styles.placeholderIcon} />
                  </div>
                  <button className={styles.btnUpload}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Ubah Foto
                  </button>
                  
                  <div className={styles.currentStock}>
                    <span className={styles.stockLabel}>Stok saat ini</span>
                    <span className={styles.stockNumber}>{stockFormData.currentStock}</span>
                  </div>
                  
                  <button 
                    className={styles.btnAddStock}
                    onClick={handleAddStockClick}
                  >
                    <Plus size={16} />
                    Tambah Stok
                  </button>
                </div>

                {/* Right side - Form fields */}
                <div className={styles.formSection}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Nama Item</label>
                      <input 
                        type="text" 
                        className={styles.inputField}
                        value={stockFormData.name}
                        onChange={(e) => setStockFormData({...stockFormData, name: e.target.value})}
                        placeholder="Masukkan nama"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Harga Jual</label>
                      <input 
                        type="number" 
                        className={styles.inputField}
                        value={stockFormData.hargaJual}
                        onChange={(e) => setStockFormData({...stockFormData, hargaJual: e.target.value})}
                        placeholder="Masukkan harga jual"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>ID Item</label>
                      <input 
                        type="text" 
                        className={styles.inputField}
                        value={stockFormData.idItem}
                        placeholder="Masukkan ID"
                        readOnly
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Tanggal Expired</label>
                      <input 
                        type="date" 
                        className={styles.inputField}
                        value={stockFormData.tanggalExpired}
                        onChange={(e) => setStockFormData({...stockFormData, tanggalExpired: e.target.value})}
                        placeholder="Masukkan tanggal expired"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Harga Beli</label>
                      <input 
                        type="number" 
                        className={styles.inputField}
                        value={stockFormData.hargaBeli}
                        onChange={(e) => setStockFormData({...stockFormData, hargaBeli: e.target.value})}
                        placeholder="Masukkan harga beli"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Kategori</label>
                      <input 
                        type="text" 
                        className={styles.inputField}
                        value={stockFormData.category}
                        onChange={(e) => setStockFormData({...stockFormData, category: e.target.value})}
                        placeholder="Masukkan kategori barang"
                      />
                    </div>
                  </div>

                  <div className={styles.stockModalActions}>
                    <button 
                      className={styles.btnDeleteItem}
                      onClick={() => {
                        setShowStockModal(false);
                        handleDeleteClick(selectedProduct);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className={styles.actionButtons}>
                      <button 
                        className={styles.btnCancel} 
                        onClick={() => setShowStockModal(false)}
                      >
                        Batal
                      </button>
                      <button 
                        className={styles.btnSave} 
                        onClick={handleSaveStock}
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '500px' }}>
            <div className={styles.deleteModalBody}>
              <div className={styles.deleteImageBox}>
                <X size={48} className={styles.placeholderIcon} />
              </div>
              
              <div className={styles.deleteFormFields}>
                <div className={styles.formGroup}>
                  <label>Nama Item</label>
                  <input 
                    type="text" 
                    className={styles.inputField}
                    value={selectedProduct?.name}
                    readOnly
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>ID Item</label>
                  <input 
                    type="text" 
                    className={styles.inputField}
                    value={`ITEM-${selectedProduct?.id}`}
                    readOnly
                  />
                </div>
              </div>

              <div className={styles.deleteActions}>
                <button 
                  className={styles.btnCancelDelete} 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Batal
                </button>
                <button 
                  className={styles.btnConfirmDelete} 
                  onClick={confirmDelete}
                >
                  Hapus
                </button>
              </div>
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
