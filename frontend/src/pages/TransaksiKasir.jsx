import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './TransaksiKasir.module.css';

const transactions = [
  {
    id: '02839726746',
    waktu: '13.45 WIB',
    tanggal: '20 Februari 2026',
    amount: 25000,
    metodePembayaran: 'Qris',
    kasir: 'Shift 1 (Nama Kasir)',
    items: [
      { jumlah: 1, nama: 'Produk 1', harga: 10000 },
      { jumlah: 1, nama: 'Produk 2', harga: 15000 },
    ],
    diskon: 0,
  },
  {
    id: '028315287612',
    waktu: '13.38 WIB',
    tanggal: '20 Februari 2026',
    amount: 10000,
    metodePembayaran: 'Tunai',
    kasir: 'Shift 1 (Nama Kasir)',
    items: [
      { jumlah: 1, nama: 'Produk A', harga: 10000 },
    ],
    diskon: 0,
  },
  {
    id: '02364347237',
    waktu: '13.33 WIB',
    tanggal: '20 Februari 2026',
    amount: 40000,
    metodePembayaran: 'Debit',
    kasir: 'Shift 1 (Nama Kasir)',
    items: [
      { jumlah: 2, nama: 'Produk B', harga: 20000 },
    ],
    diskon: 0,
  },
  {
    id: '02839536780',
    waktu: '13.20 WIB',
    tanggal: '20 Februari 2026',
    amount: 15000,
    metodePembayaran: 'Qris',
    kasir: 'Shift 1 (Nama Kasir)',
    items: [
      { jumlah: 1, nama: 'Produk C', harga: 15000 },
    ],
    diskon: 0,
  },
  {
    id: '028621168266',
    waktu: '13.06 WIB',
    tanggal: '20 Februari 2026',
    amount: 20000,
    metodePembayaran: 'Tunai',
    kasir: 'Shift 1 (Nama Kasir)',
    items: [
      { jumlah: 2, nama: 'Produk D', harga: 10000 },
    ],
    diskon: 0,
  },
  {
    id: '02839000067',
    waktu: '12.55 WIB',
    tanggal: '20 Februari 2026',
    amount: 40000,
    metodePembayaran: 'Debit',
    kasir: 'Shift 1 (Nama Kasir)',
    items: [
      { jumlah: 4, nama: 'Produk E', harga: 10000 },
    ],
    diskon: 0,
  },
  {
    id: '028736376137',
    waktu: '12.39 WIB',
    tanggal: '20 Februari 2026',
    amount: 30000,
    metodePembayaran: 'Qris',
    kasir: 'Shift 1 (Nama Kasir)',
    items: [
      { jumlah: 3, nama: 'Produk F', harga: 10000 },
    ],
    diskon: 0,
  },
  {
    id: '025323723681',
    waktu: '12.25 WIB',
    tanggal: '20 Februari 2026',
    amount: 50000,
    metodePembayaran: 'Tunai',
    kasir: 'Shift 1 (Nama Kasir)',
    items: [
      { jumlah: 2, nama: 'Produk G', harga: 25000 },
    ],
    diskon: 0,
  },
];

export default function TransaksiKasir() {
  const [selectedTx, setSelectedTx] = useState(null);

  const subTotal = selectedTx
    ? selectedTx.items.reduce((sum, i) => sum + i.jumlah * i.harga, 0)
    : 0;
  const total = subTotal - (selectedTx?.diskon ?? 0);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Riwayat Transaksi</h2>

      <table>
        <thead>
          <tr>
            <th>ID Order</th>
            <th>Waktu</th>
            <th>Nominal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>20/02/2026, {tx.waktu}</td>
              <td>Rp{tx.amount.toLocaleString('id-ID')}</td>
              <td style={{ textAlign: 'right' }}>
                <button
                  className={styles.lihatRincian}
                  onClick={() => setSelectedTx(tx)}
                >
                  Lihat Rincian
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Receipt Modal */}
      {selectedTx && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTx(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            
            <h2 className={styles.modalTitle}>Riwayat Transaksi</h2>
            <button className={styles.btnClose} onClick={() => setSelectedTx(null)}>
              <X size={22} />
            </button>

            {/* Store Info */}
            <div className={styles.storeHeader}>
              <div>(Nama Toko)</div>
              <div>(Alamat Toko)</div>
              <div>(xxx) xxx-xxxx</div>
            </div>

            {/* Transaction Info */}
            <table className={styles.infoTable}>
              <tbody>
                <tr>
                  <td>ID Order</td>
                  <td>{selectedTx.id}</td>
                </tr>
                <tr>
                  <td>Waktu</td>
                  <td>{selectedTx.waktu}</td>
                </tr>
                <tr>
                  <td>Tanggal</td>
                  <td>{selectedTx.tanggal}</td>
                </tr>
                <tr>
                  <td>Metode Pembayaran</td>
                  <td>{selectedTx.metodePembayaran}</td>
                </tr>
                <tr>
                  <td>Kasir</td>
                  <td>{selectedTx.kasir}</td>
                </tr>
              </tbody>
            </table>

            <hr className={styles.dashed} />

            {/* Item List */}
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Jumlah</th>
                  <th>Item</th>
                  <th>Harga</th>
                </tr>
              </thead>
              <tbody>
                {selectedTx.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.jumlah}</td>
                    <td style={{ textAlign: 'center' }}>{item.nama}</td>
                    <td style={{ textAlign: 'right' }}>
                      Rp{(item.jumlah * item.harga).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr className={styles.dashed} />

            {/* Totals */}
            <div className={styles.totalsSection}>
              <div className={styles.totalRow}>
                <span>Sub Total</span>
                <span>Rp{subTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Diskon</span>
                <span>Rp{(selectedTx.diskon).toLocaleString('id-ID')}</span>
              </div>
              <div className={styles.grandTotal}>
                <span>Total</span>
                <span>Rp{total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.modalActions}>
              <button className={styles.btnRetur}>Retur</button>
              <button className={styles.btnCetak}>Cetak Ulang Struk</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
