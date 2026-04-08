import { useState } from 'react';
import { Search, X, Check, Banknote, QrCode } from 'lucide-react';
import styles from './MenuKasir.module.css';

// Mock DB
const DUMMY_PRODUCTS = [
  { id: 1, name: 'Produk 1', price: 10000, stock: 10 },
  { id: 2, name: 'Produk 2', price: 10000, stock: 10 },
  { id: 3, name: 'Produk 3', price: 10000, stock: 10 },
  { id: 4, name: 'Produk 4', price: 10000, stock: 10 },
  { id: 5, name: 'Produk 5', price: 10000, stock: 10 },
  { id: 6, name: 'Produk 6', price: 10000, stock: 10 },
  { id: 7, name: 'Produk 7', price: 10000, stock: 10 },
  { id: 8, name: 'Produk 8', price: 10000, stock: 10 },
];

const CATEGORIES = ['Semua Produk', 'Sub 1', 'Sub 2', 'Sub 3', 'Sub 4'];

export default function MenuKasir() {
  const [activeTab, setActiveTab] = useState('Semua Produk');
  
  // Cart state: array of { product, qty }
  const [cart, setCart] = useState([]);
  
  // Payment states
  const [paymentStep, setPaymentStep] = useState(0); // 0=none, 1=method, 2=cash input, 3=success, 4=qris
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cashInput, setCashInput] = useState('');

  // Computations
  const subTotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
  const diskon = 0;
  const total = subTotal - diskon;

  // Add to cart
  const handleAddProduct = (product) => {
    setCart((prev) => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const handleUpdateQty = (productId, delta) => {
    setCart((prev) => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.qty + delta;
          return { ...item, qty: newQty };
        }
        return item;
      }).filter(item => item.qty > 0);
    });
  };

  const handleProcessBtn = () => {
    if (cart.length > 0) {
      setPaymentStep(1); // open method modal
      setPaymentMethod('');
    }
  };

  const handleMethodConfirm = () => {
    if (paymentMethod === 'tunai') {
      setPaymentStep(2); // move to cash input modal
      setCashInput(total.toString()); // auto-fill default total
    } else if (paymentMethod === 'qris') {
      setPaymentStep(4); // move to QRIS scan modal
    }
  };

  const handleCashConfirm = () => {
    // Show success 
    setPaymentStep(3);
  };

  const handleDone = () => {
    setPaymentStep(0);
    setCart([]);
    setCashInput('');
  };

  return (
    <div className={styles.container}>
      
      {/* LEFT PANEL - CATALOG */}
      <div className={styles.leftPanel}>
        <div className={styles.toolbar}>
          <div className={styles.tabs}>
            {CATEGORIES.map(cat => (
              <div 
                key={cat} 
                className={`${styles.tab} ${activeTab === cat ? styles.active : ''}`}
                onClick={() => setActiveTab(cat)}
              >
                {cat}
              </div>
            ))}
          </div>

          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Cari Produk" className={styles.searchInput} />
          </div>
        </div>

        <div className={styles.productGrid}>
          {DUMMY_PRODUCTS.map(product => (
            <div key={product.id} className={styles.productCard} onClick={() => handleAddProduct(product)}>
               <div className={styles.productImagePlaceholder}>
                 <X size={80} strokeWidth={3} />
               </div>
               <div className={styles.productInfo}>
                 <span className={styles.productName}>{product.name}</span>
                 <span className={styles.productPrice}>Rp{product.price.toLocaleString('id-ID')}</span>
                 <span className={styles.productStock}>Stok : {product.stock}</span>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL - ORDER CART */}
      <div className={styles.rightPanel}>
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitle}>Detail Pesanan</h2>
          <div className={styles.orderInfo}>
             <div className={styles.orderInfoRow}>
               <span>Order ID</span>
               <span style={{color: 'var(--color-text-main)'}}>02839766746</span>
             </div>
             <div className={styles.orderInfoRow}>
               <span>Waktu</span>
               <span style={{color: 'var(--color-text-main)'}}>20/02/2026, 14.00 WIB</span>
             </div>
          </div>
        </div>

        <div className={styles.cartItems}>
          {cart.map(item => (
            <div key={item.product.id} className={styles.cartItem}>
              <div className={styles.itemImage}></div>
              <div className={styles.itemDetails}>
                <span className={styles.itemName}>{item.product.name}</span>
                <span className={styles.itemPrice}>Rp{item.product.price.toLocaleString('id-ID')}</span>
                <div className={styles.itemQtyCtrl}>
                  <button className={styles.qtyBtn} onClick={(e) => { e.stopPropagation(); handleUpdateQty(item.product.id, -1); }}>-</button>
                  <span className={styles.qtyValue}>{item.qty}</span>
                  <button className={`${styles.qtyBtn} ${styles.plus}`} onClick={(e) => { e.stopPropagation(); handleUpdateQty(item.product.id, 1); }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cartFooter}>
          <div className={styles.totalRow}>
            <span>Sub Total</span>
            <span>Rp{subTotal.toLocaleString('id-ID')}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Diskon</span>
            <span>Rp{diskon}</span>
          </div>
          <div className={styles.totalDivider}></div>
          <div className={styles.grandTotalRow}>
            <span>Total</span>
            <span>Rp{total.toLocaleString('id-ID')}</span>
          </div>

          <button 
            className={styles.btnProses} 
            disabled={cart.length === 0}
            onClick={handleProcessBtn}
          >
            Proses Pembayaran
          </button>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* STEP 1: Pilih Metode Pembayaran */}
      {paymentStep === 1 && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Pilih Metode Pembayaran</h2>
              <button className={styles.btnClose} onClick={() => setPaymentStep(0)}><X size={20} /></button>
            </div>
            
            <div className={styles.inputGroup}>
              <label>Total</label>
              <input type="text" className={styles.inputField} value={`Rp${total.toLocaleString('id-ID')}`} readOnly />
            </div>

            <div className={styles.methodGrid}>
              <div 
                className={`${styles.methodCard} ${paymentMethod === 'tunai' ? styles.active : ''}`}
                onClick={() => setPaymentMethod('tunai')}
              >
                <Banknote size={28} />
                <span>Tunai</span>
              </div>
              <div 
                className={`${styles.methodCard} ${paymentMethod === 'qris' ? styles.active : ''}`}
                onClick={() => setPaymentMethod('qris')}
              >
                <QrCode size={28} />
                <span>Qris</span>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={() => setPaymentStep(0)}>Batal</button>
              <button className={styles.btnConfirm} onClick={handleMethodConfirm} disabled={!paymentMethod}>Konfirmasi</button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Pembayaran Tunai Input */}
      {paymentStep === 2 && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Pembayaran Tunai</h2>
              <button className={styles.btnClose} onClick={() => setPaymentStep(0)}><X size={20} /></button>
            </div>
            
            <div className={styles.inputGroup}>
              <label>Total</label>
              <input type="text" className={styles.inputField} value={`Rp${total.toLocaleString('id-ID')}`} readOnly />
            </div>

            <div className={styles.inputGroup} style={{ marginBottom: '32px' }}>
              <label>Uang Dibayarkan</label>
              <input 
                type="number" 
                className={styles.inputField} 
                value={cashInput} 
                onChange={(e) => setCashInput(e.target.value)}
                placeholder="Masukkan Jumlah yang Dibayarkan" 
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={() => setPaymentStep(1)}>Batal</button>
              <button 
                className={styles.btnConfirm} 
                onClick={handleCashConfirm}
                disabled={!cashInput || Number(cashInput) < total}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Success / Kembalian */}
      {paymentStep === 3 && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className={styles.modalHeader} style={{ marginBottom: 0 }}>
              <h2 style={{ fontSize: '16px' }}>Pembayaran {paymentMethod === 'tunai' ? 'Tunai' : 'Qris'}</h2>
              <button className={styles.btnClose} onClick={handleDone}><X size={20} /></button>
            </div>

            {paymentMethod === 'tunai' && (
              <div className={styles.inputGroup}>
                <label>Kembalian</label>
                <input 
                  type="text" 
                  className={styles.inputField} 
                  value={`Rp${(Math.max(0, Number(cashInput) - total)).toLocaleString('id-ID')}`} 
                  readOnly 
                />
              </div>
            )}

            <div className={styles.successContent}>
              <div className={styles.successIcon}>
                <Check size={48} strokeWidth={4} />
              </div>
              <h2 className={styles.successTitle}>Pembayaran Berhasil</h2>
              <button className={styles.btnSelesai} onClick={handleDone}>Selesai</button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Pembayaran QRIS */}
      {paymentStep === 4 && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Pembayaran Qris</h2>
              <button className={styles.btnClose} onClick={() => setPaymentStep(0)}><X size={20} /></button>
            </div>
            
            <div className={styles.inputGroup}>
              <label>Total</label>
              <input type="text" className={styles.inputField} value={`Rp${total.toLocaleString('id-ID')}`} readOnly />
            </div>

            <div className={styles.qrisContainer}>
              <div 
                className={styles.qrCodeBox} 
                onClick={() => setPaymentStep(3)} 
                title="Klik QR Code untuk simulasi pembayaran berhasil!"
              >
                <QrCode size={180} strokeWidth={1} color="#111" />
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={() => setPaymentStep(1)}>Batal</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
