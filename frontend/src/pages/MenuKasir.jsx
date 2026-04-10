import { useState, useEffect } from 'react';
import { Search, X, Check, Banknote, QrCode } from 'lucide-react';
import styles from './MenuKasir.module.css';
import { productAPI, categoryAPI, transactionAPI } from '../services/api';

export default function MenuKasir() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua Produk');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentStep, setPaymentStep] = useState(0); // 0=none,1=method,2=cash,3=success,4=qris
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cashInput, setCashInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([productAPI.getAll(), categoryAPI.getAll()]);
      setProducts(prodRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (err) {
      console.error('Gagal memuat produk:', err);
    } finally { setLoading(false); }
  };

  // Filter produk berdasarkan tab kategori dan search
  const filteredProducts = products.filter(p => {
    const matchSearch = (p.name || p.nama || '').toLowerCase().includes(searchQuery.toLowerCase());
    // p.category dari backend adalah object {_id, name} setelah populate
    const catId = typeof p.category === 'object' ? p.category?._id : (p.category || p.kategori);
    const matchCat = activeTab === 'Semua Produk' || catId === activeTab;
    return matchSearch && matchCat && (p.stock ?? p.stok ?? 0) > 0;
  });

  const subTotal = cart.reduce((sum, item) => sum + (item.product.hargaJual * item.qty), 0);
  const diskon = 0;
  const total = subTotal - diskon;
  const kembalian = parseInt(cashInput || 0) - total;

  const handleAddProduct = (product) => {
    if ((product.stock ?? product.stok ?? 0) <= 0) return;
    setCart(prev => {
      const existing = prev.find(i => i.product._id === product._id);
      if (existing) {
        if (existing.qty >= (product.stock ?? product.stok ?? 0)) return prev; // jangan melebihi stok
        return prev.map(i => i.product._id === product._id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const handleUpdateQty = (productId, delta) => {
    setCart(prev =>
      prev.map(item => item.product._id === productId ? { ...item, qty: item.qty + delta } : item)
        .filter(item => item.qty > 0)
    );
  };

  // Simpan transaksi ke backend
  const handleCashConfirm = async () => {
    if (parseInt(cashInput) < total) return alert('Uang yang diberikan kurang!');
    try {
      setSubmitting(true);
      const kasir = JSON.parse(localStorage.getItem('user') || '{}');
      await transactionAPI.create({
        // Format BENAR sesuai backend: productId, qty, paymentMethod, bayar
        items: cart.map(i => ({
          productId: i.product._id,  // ← pakai productId
          qty: i.qty,
          // Backend akan hitung harga sendiri dari database
        })),
        paymentMethod: 'tunai',   // ← pakai paymentMethod
        bayar: parseInt(cashInput), // ← pakai bayar
        diskon,
        pajak: 0,
      });
      setPaymentStep(3);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan transaksi');
    } finally { setSubmitting(false); }
  };

  const handleQrisConfirm = async () => {
    try {
      setSubmitting(true);
      const kasir = JSON.parse(localStorage.getItem('user') || '{}');
      await transactionAPI.create({
        items: cart.map(i => ({
          productId: i.product._id,
          qty: i.qty,
        })),
        paymentMethod: 'qris',
        bayar: total,
        diskon,
        pajak: 0,
      });
      setPaymentStep(3);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan transaksi');
    } finally { setSubmitting(false); }
  };

  const handleDone = () => {
    setPaymentStep(0);
    setCart([]);
    setCashInput('');
    fetchData(); // refresh stok
  };

  const formatRp = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');
  const tabList = ['Semua Produk', ...categories.map(c => c._id)];
  const tabLabels = { 'Semua Produk': 'Semua Produk', ...Object.fromEntries(categories.map(c => [c._id, c.nama || c.name])) };

  return (
    <div className={styles.container}>
      {/* LEFT PANEL - CATALOG */}
      <div className={styles.leftPanel}>
        <div className={styles.toolbar}>
          <div className={styles.tabs}>
            {tabList.map(tab => (
              <div key={tab} className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`} onClick={() => setActiveTab(tab)}>
                {tabLabels[tab] || tab}
              </div>
            ))}
          </div>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Cari Produk" className={styles.searchInput} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>⏳ Memuat produk...</div>
        ) : (
          <div className={styles.productGrid}>
            {filteredProducts.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                {searchQuery ? 'Produk tidak ditemukan' : 'Belum ada produk tersedia'}
              </div>
            ) : filteredProducts.map(product => (
              <div key={product._id} className={styles.productCard} onClick={() => handleAddProduct(product)}>
                <div className={styles.productImagePlaceholder}>
                  {(product.image || product.foto) ? (
                    <img src={product.image || product.foto} alt={product.name || product.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <X size={80} strokeWidth={3} />
                  )}
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.productName}>{product.name || product.nama}</span>
                  <span className={styles.productPrice}>{formatRp(product.hargaJual)}</span>
                  <span className={styles.productStock}>Stok: {product.stock ?? product.stok ?? 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT PANEL - CART */}
      <div className={styles.rightPanel}>
        <div className={styles.cartHeader}>
          <h3>Keranjang</h3>
          {cart.length > 0 && (
            <button onClick={() => setCart([])} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}>Kosongkan</button>
          )}
        </div>

        <div className={styles.cartItems}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: '14px' }}>Belum ada produk dipilih</div>
          ) : cart.map(item => (
            <div key={item.product._id} className={styles.cartItem}>
              <div className={styles.cartItemInfo}>
                <span className={styles.cartItemName}>{item.product.name || item.product.nama}</span>
                <span className={styles.cartItemPrice}>{formatRp(item.product.hargaJual)}</span>
              </div>
              <div className={styles.qtyControl}>
                <button className={styles.qtyBtn} onClick={() => handleUpdateQty(item.product._id, -1)}>−</button>
                <span className={styles.qtyNum}>{item.qty}</span>
                <button className={styles.qtyBtn} onClick={() => handleUpdateQty(item.product._id, 1)}>+</button>
              </div>
              <span className={styles.cartItemSubtotal}>{formatRp(item.product.hargaJual * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className={styles.cartSummary}>
          <div className={styles.summaryRow}><span>Sub Total</span><span>{formatRp(subTotal)}</span></div>
          <div className={styles.summaryRow}><span>Diskon</span><span>{formatRp(diskon)}</span></div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Total</span><span>{formatRp(total)}</span></div>
        </div>

        <button className={styles.processBtn} onClick={() => cart.length > 0 && setPaymentStep(1)} disabled={cart.length === 0}
          style={{ opacity: cart.length === 0 ? 0.5 : 1, cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}>
          Proses Pembayaran
        </button>
      </div>

      {/* MODAL 1 — Pilih Metode Bayar */}
      {paymentStep === 1 && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3 style={{ marginBottom: '16px' }}>Pilih Metode Pembayaran</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button onClick={() => setPaymentMethod('tunai')} style={{ flex: 1, padding: '16px', borderRadius: '8px', border: `2px solid ${paymentMethod === 'tunai' ? '#000' : '#e5e7eb'}`, background: paymentMethod === 'tunai' ? '#000' : '#fff', color: paymentMethod === 'tunai' ? '#fff' : '#000', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Banknote size={24} /><span>Tunai</span>
              </button>
              <button onClick={() => setPaymentMethod('qris')} style={{ flex: 1, padding: '16px', borderRadius: '8px', border: `2px solid ${paymentMethod === 'qris' ? '#000' : '#e5e7eb'}`, background: paymentMethod === 'qris' ? '#000' : '#fff', color: paymentMethod === 'qris' ? '#fff' : '#000', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <QrCode size={24} /><span>QRIS</span>
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setPaymentStep(0)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>Batal</button>
              <button onClick={() => { if (paymentMethod === 'tunai') { setPaymentStep(2); setCashInput(''); } else if (paymentMethod === 'qris') setPaymentStep(4); }}
                disabled={!paymentMethod}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: paymentMethod ? '#000' : '#e5e7eb', color: '#fff', cursor: paymentMethod ? 'pointer' : 'not-allowed' }}>
                Lanjut
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2 — Input Uang Tunai */}
      {paymentStep === 2 && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3 style={{ marginBottom: '16px' }}>Pembayaran Tunai</h3>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Total Bayar</span><strong>{formatRp(total)}</strong></div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Uang Diberikan</label>
              <input type="number" value={cashInput} onChange={e => setCashInput(e.target.value)} placeholder="Masukkan nominal"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
            {cashInput && parseInt(cashInput) >= total && (
              <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#16a34a' }}>Kembalian</span>
                <strong style={{ color: '#16a34a' }}>{formatRp(kembalian)}</strong>
              </div>
            )}
            {/* Tombol nominal cepat */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {[5000, 10000, 20000, 50000, 100000].map(n => (
                <button key={n} onClick={() => setCashInput(String(n))} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontSize: '12px' }}>
                  {formatRp(n)}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setPaymentStep(1)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>Kembali</button>
              <button onClick={handleCashConfirm} disabled={!cashInput || parseInt(cashInput) < total || submitting}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: (cashInput && parseInt(cashInput) >= total) ? '#000' : '#e5e7eb', color: '#fff', cursor: (cashInput && parseInt(cashInput) >= total) ? 'pointer' : 'not-allowed' }}>
                {submitting ? '⏳...' : 'Konfirmasi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3 — Sukses */}
      {paymentStep === 3 && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox} style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Check size={32} color="#16a34a" />
            </div>
            <h3 style={{ marginBottom: '8px' }}>Transaksi Berhasil!</h3>
            <p style={{ color: '#6b7280', marginBottom: '8px' }}>Total: <strong>{formatRp(total)}</strong></p>
            {paymentMethod === 'tunai' && (
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>Kembalian: <strong style={{ color: '#16a34a' }}>{formatRp(kembalian)}</strong></p>
            )}
            <button onClick={handleDone} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#000', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>
              Transaksi Baru
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4 — QRIS */}
      {paymentStep === 4 && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox} style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '8px' }}>Scan QRIS</h3>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>Total: <strong>{formatRp(total)}</strong></p>
            <div style={{ width: '180px', height: '180px', background: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <QrCode size={80} color="#374151" />
            </div>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>Silakan scan QR di atas menggunakan aplikasi pembayaran</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setPaymentStep(1)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>Kembali</button>
              <button onClick={handleQrisConfirm} disabled={submitting} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#000', color: '#fff', cursor: 'pointer' }}>
                {submitting ? '⏳...' : 'Sudah Bayar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
