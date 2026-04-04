import { useState, useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ShoppingCart, Wallet, TrendingDown, Calendar, ChevronDown, ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import styles from './Laporan.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_NAMES   = ['S','M','T','W','T','F','S'];

// ── helpers ───────────────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return '';
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}
function isSameDay(a, b) {
  return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}
function isBetween(d, start, end) {
  if (!d || !start || !end) return false;
  return d > start && d < end;
}

// ── Year Dropdown (shared) ────────────────────────────────────────────────────
function YearSelect({ year, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 4 + i);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className={styles.yearWrap} ref={ref}>
      <button className={styles.yearBtn} onClick={() => setOpen(o => !o)}>
        {year} <ChevronDown size={12} />
      </button>
      {open && (
        <div className={styles.yearMenu}>
          {years.map(y => (
            <div key={y} className={`${styles.yearItem} ${y === year ? styles.yearActive : ''}`}
              onClick={() => { onChange(y); setOpen(false); }}>{y}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Cal Harian (range: start → end) ──────────────────────────────────────────
function CalHarian({ range, onSelect }) {
  // range = { start: Date|null, end: Date|null }
  // picking: first click = start, second = end
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [hover, setHover] = useState(null);

  const firstDay    = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const prevDays    = new Date(view.year, view.month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ d: prevDays - i, cur: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ d, cur: true });
  while (cells.length < 42) cells.push({ d: cells.length - firstDay - daysInMonth + 2, cur: false });

  const prev = () => setView(v => { const dt = new Date(v.year, v.month-1,1); return { year: dt.getFullYear(), month: dt.getMonth() }; });
  const next = () => setView(v => { const dt = new Date(v.year, v.month+1,1); return { year: dt.getFullYear(), month: dt.getMonth() }; });

  const handleClick = (date) => {
    if (!range.start || (range.start && range.end)) {
      onSelect({ start: date, end: null });
    } else {
      if (date < range.start) onSelect({ start: date, end: range.start });
      else onSelect({ start: range.start, end: date });
    }
  };

  const previewEnd = range.start && !range.end ? hover : range.end;

  return (
    <div className={styles.calBox}>
      <div className={styles.calHead}>
        <button className={styles.calNav} onClick={prev}><ChevronLeft size={14}/></button>
        <span className={styles.calMonthLabel}>{MONTH_NAMES[view.month]}</span>
        <button className={styles.calNav} onClick={next}><ChevronRight size={14}/></button>
        <YearSelect year={view.year} onChange={(y) => setView(v => ({ ...v, year: y }))} />
      </div>
      <div className={styles.calDayRow}>
        {DAY_NAMES.map((d,i) => <div key={i} className={styles.calDayName}>{d}</div>)}
      </div>
      <div className={styles.calGrid7}>
        {cells.map((c, i) => {
          const date  = c.cur ? new Date(view.year, view.month, c.d) : null;
          const isStart = date && isSameDay(date, range.start);
          const isEnd   = date && isSameDay(date, previewEnd);
          const inRange = date && range.start && previewEnd && isBetween(date, range.start, previewEnd);
          const isToday = date && isSameDay(date, today);
          return (
            <div key={i}
              className={[
                styles.calCell,
                !c.cur ? styles.calOther : styles.calCur,
                isStart || isEnd ? styles.calSel : '',
                inRange ? styles.calInRange : '',
                isToday && !isStart && !isEnd ? styles.calToday : '',
              ].join(' ')}
              onClick={() => c.cur && handleClick(date)}
              onMouseEnter={() => c.cur && setHover(date)}
              onMouseLeave={() => setHover(null)}
            >{c.d}</div>
          );
        })}
      </div>
    </div>
  );
}

// ── Cal Mingguan ──────────────────────────────────────────────────────────────
function CalMingguan({ range, onSelect }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const prev = () => setView(v => { const dt = new Date(v.year, v.month-1,1); return { year: dt.getFullYear(), month: dt.getMonth() }; });
  const next = () => setView(v => { const dt = new Date(v.year, v.month+1,1); return { year: dt.getFullYear(), month: dt.getMonth() }; });

  // Build 6-row grid (42 cells), Sunday-first
  const firstDay    = new Date(view.year, view.month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const prevDays    = new Date(view.year, view.month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ d: prevDays - i, cur: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ d, cur: true });
  let nextD = 1;
  while (cells.length < 42) cells.push({ d: nextD++, cur: false });

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  // Assign weekNum max 4 to rows with cur days
  let weekCounter = 0;
  const rowMeta = rows.map(row => {
    const hasCur = row.some(c => c.cur);
    if (hasCur && weekCounter < 4) { weekCounter++; return { hasCur: true, weekNum: weekCounter }; }
    return { hasCur: false, weekNum: null };
  });

  // Index of the row right after Minggu 4 (overflow bottom)
  const minggu4RowIdx     = rowMeta.findIndex(m => m.weekNum === 4);
  const overflowBotIdx    = minggu4RowIdx >= 0 ? minggu4RowIdx + 1 : -1;

  const makeKey = (obj) => obj ? `${obj.year}-${obj.month}-${obj.week}` : null;
  const rowKey  = (wn)  => `${view.year}-${view.month}-${wn}`;

  const handleClick = (weekNum) => {
    const picked = { year: view.year, month: view.month, week: weekNum };
    if (!range.start || (range.start && range.end)) {
      onSelect({ start: picked, end: null });
    } else {
      const sk = makeKey(range.start), pk = rowKey(weekNum);
      if (pk < sk) onSelect({ start: picked, end: range.start });
      else         onSelect({ start: range.start, end: picked });
    }
  };

  const isSelRow  = (wn) => { const k = rowKey(wn); return makeKey(range.start)===k || makeKey(range.end)===k; };
  const isInRange = (wn) => {
    if (!range.start || !range.end) return false;
    const k = rowKey(wn);
    return k > makeKey(range.start) && k < makeKey(range.end);
  };

  // Overflow bottom follows Minggu 4 highlight
  const minggu4Highlighted = isSelRow(4) || isInRange(4);

  return (
    <div className={styles.calBox} style={{ minWidth: 460 }}>
      <div className={styles.calHead}>
        <button className={styles.calNav} onClick={prev}><ChevronLeft size={14}/></button>
        <span className={styles.calMonthLabel}>{MONTH_NAMES[view.month]}</span>
        <button className={styles.calNav} onClick={next}><ChevronRight size={14}/></button>
        <YearSelect year={view.year} onChange={(y) => setView(v => ({ ...v, year: y }))} />
      </div>

      <table className={styles.weekTable}>
        <thead>
          <tr>
            <th className={styles.weekKeTh}>Minggu Ke</th>
            {DAY_NAMES.map((d,i) => <th key={i} className={styles.weekDayTh}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const { hasCur, weekNum } = rowMeta[ri];
            const isOverflowBot = ri === overflowBotIdx;
            const isClickable   = hasCur && weekNum !== null;
            const selRow        = isClickable && isSelRow(weekNum);
            const rangeRow      = isClickable && isInRange(weekNum);
            // overflow bottom row inherits Minggu 4 highlight
            const overflowSel   = isOverflowBot && minggu4Highlighted;

            return (
              <tr key={ri}
                className={[
                  isClickable ? styles.weekRowClickable : styles.weekRowOverflow,
                  selRow || overflowSel ? styles.weekRowSel : '',
                  rangeRow ? styles.weekRowRange : '',
                ].join(' ')}
                onClick={() => isClickable && handleClick(weekNum)}
              >
                <td className={styles.weekKeTd}>
                  {weekNum ? `Minggu ${weekNum}` : ''}
                </td>
                {row.map((c, ci) => {
                  const isToday = c.cur && isSameDay(new Date(view.year, view.month, c.d), today);
                  return (
                    <td key={ci} className={[
                      styles.weekCell,
                      !c.cur ? styles.weekCellOther : '',
                      isToday ? styles.weekCellToday : '',
                    ].join(' ')}>
                      {c.d}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Cal Bulanan (range: bulan start → bulan end) ──────────────────────────────
function CalBulanan({ range, onSelect }) {
  // range = { start: {year,month}|null, end: {year,month}|null }
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const rows = [months.slice(0,4), months.slice(4,8), months.slice(8,12)];

  const toNum = (obj) => obj ? obj.year * 12 + obj.month : null;

  const handleClick = (idx) => {
    const picked = { year, month: idx };
    if (!range.start || (range.start && range.end)) {
      onSelect({ start: picked, end: null });
    } else {
      const ps = toNum(range.start), pp = year * 12 + idx;
      if (pp < ps) onSelect({ start: picked, end: range.start });
      else onSelect({ start: range.start, end: picked });
    }
  };

  return (
    <div className={styles.calBox} style={{ minWidth: 300 }}>
      <div className={styles.calHead}>
        <button className={styles.calNav} onClick={() => setYear(y => y-1)}><ChevronLeft size={14}/></button>
        <span className={styles.calMonthLabel}>{year}</span>
        <button className={styles.calNav} onClick={() => setYear(y => y+1)}><ChevronRight size={14}/></button>
      </div>
      <div className={styles.monthGrid}>
        {rows.map((row, ri) => (
          <div key={ri} className={styles.monthRow}>
            {row.map((m, mi) => {
              const idx  = ri * 4 + mi;
              const num  = year * 12 + idx;
              const sNum = toNum(range.start), eNum = toNum(range.end);
              const isSel   = num === sNum || num === eNum;
              const inRange = sNum != null && eNum != null && num > sNum && num < eNum;
              const isCur   = today.getFullYear() === year && today.getMonth() === idx;
              return (
                <div key={mi}
                  className={[
                    styles.monthCell,
                    isSel ? styles.monthSel : '',
                    inRange ? styles.monthInRange : '',
                    isCur && !isSel ? styles.monthCur : '',
                  ].join(' ')}
                  onClick={() => handleClick(idx)}
                >{m}</div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DateFilterBtn ─────────────────────────────────────────────────────────────
function DateFilterBtn({ periode, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const label = () => {
    if (periode === 'Harian') {
      if (!value?.start) return 'Pilih Tanggal';
      if (!value?.end)   return fmtDate(value.start) + ' - ...';
      return `${fmtDate(value.start)} - ${fmtDate(value.end)}`;
    }
    if (periode === 'Mingguan') {
      if (!value?.start) return 'Pilih Minggu';
      if (!value?.end)   return `Minggu ${value.start.week}`;
      return `Minggu ${value.start.week} - Minggu ${value.end.week}`;
    }
    if (periode === 'Bulanan') {
      if (!value?.start) return 'Januari - Desember';
      if (!value?.end)   return MONTH_NAMES[value.start.month];
      return `${MONTH_NAMES[value.start.month]} - ${MONTH_NAMES[value.end.month]}`;
    }
    return 'Pilih Periode';
  };

  return (
    <div className={styles.datePickerWrap} ref={ref}>
      <button className={styles.dateBtn} onClick={() => setOpen(o => !o)}>
        <Calendar size={14} />
        {label()}
      </button>
      {open && (
        <div className={styles.calDropdown}>
          <p className={styles.calDropTitle}>Filter periode {periode.toLowerCase()}</p>
          {periode === 'Harian'   && <CalHarian    range={value || { start:null, end:null }} onSelect={onChange} />}
          {periode === 'Mingguan' && <CalMingguan  range={value || { start:null, end:null }} onSelect={onChange} />}
          {periode === 'Bulanan'  && <CalBulanan   range={value || { start:null, end:null }} onSelect={onChange} />}
          {periode === 'Tahunan'  && (
            <div className={styles.calBox} style={{ padding: '12px 0' }}>
              <p style={{ color:'#6b7280', fontSize:13, textAlign:'center' }}>Coming soon</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── PeriodeDropdown ───────────────────────────────────────────────────────────
function PeriodeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const options = ['Harian','Mingguan','Bulanan','Tahunan'];
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className={styles.dropWrap} ref={ref}>
      <button className={styles.dropBtn} onClick={() => setOpen(o => !o)}>
        {value} <ChevronDown size={14}/>
      </button>
      {open && (
        <div className={styles.dropMenu}>
          {options.map(o => (
            <div key={o} className={`${styles.dropItem} ${o===value ? styles.dropItemActive : ''}`}
              onClick={() => { onChange(o); setOpen(false); }}>{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const chartLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const chartValues = [3900000,4400000,3900000,3700000,4900000,6800000,5000000,5800000,0,0,0,0];
const historyData = [
  { transaksi:'Tesco Market', bulan:'Januari',  nominal:4000000 },
  { transaksi:'Tesco Market', bulan:'Februari', nominal:4500000 },
  { transaksi:'Tesco Market', bulan:'Maret',    nominal:4000000 },
  { transaksi:'Tesco Market', bulan:'April',    nominal:3800000 },
  { transaksi:'Tesco Market', bulan:'Mei',      nominal:5000000 },
  { transaksi:'Tesco Market', bulan:'Juni',     nominal:7000000 },
  { transaksi:'Tesco Market', bulan:'Juli',     nominal:5000000 },
  { transaksi:'Tesco Market', bulan:'Agustus',  nominal:6000000 },
];
const fmt = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Laporan() {
  const [periode, setPeriode]     = useState('Bulanan');
  const [dateValue, setDateValue] = useState(null);

  const handlePeriodeChange = (p) => { setPeriode(p); setDateValue(null); };

  const chartData = {
    labels: chartLabels,
    datasets: [{ data: chartValues, backgroundColor: '#111827', borderRadius: 4, barPercentage: 0.6 }],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => fmt(ctx.raw) } } },
    scales: {
      y: {
        beginAtZero: true, min: 2000000,
        ticks: { callback: (v) => v===0 ? '' : 'Rp. '+new Intl.NumberFormat('id-ID').format(v), stepSize: 1000000 },
        grid: { color: '#F0F0F0' }, border: { display: false },
      },
      x: { grid: { display: false }, border: { display: false } },
    },
  };

  return (
    <div className={styles.page}>
      {/* Cards */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardIcon}><ShoppingCart size={26}/></div>
          <div className={styles.cardBody}>
            <span className={styles.cardLbl}>Total transaksi</span>
            <span className={styles.cardVal}>50</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}><Wallet size={26}/></div>
          <div className={styles.cardBody}>
            <span className={styles.cardLbl}>Total Penjualan</span>
            <span className={styles.cardVal}>Rp 30.000.000</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}><TrendingDown size={26}/></div>
          <div className={styles.cardBody}>
            <span className={styles.cardLbl}>Total Pengeluaran</span>
            <span className={styles.cardVal}>Rp 1.500.000</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterLeft}>
          <PeriodeDropdown value={periode} onChange={handlePeriodeChange} />
          <DateFilterBtn periode={periode} value={dateValue} onChange={setDateValue} />
        </div>
        <button className={styles.btnCetak}><Printer size={15}/> Cetak Laporan PDF</button>
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Grafik Penjualan Bulanan</h3>
          <div className={styles.chartWrap}><Bar data={chartData} options={chartOptions}/></div>
        </div>
        <div className={styles.historyCard}>
          <h3 className={styles.historyTitle}>Transaction history</h3>
          <div className={styles.historyTable}>
            <div className={styles.historyHeader}>
              <span>Transaksi</span><span>Bulan</span><span>Nominal</span>
            </div>
            {historyData.map((row, i) => (
              <div key={i} className={styles.historyRow}>
                <span>{row.transaksi}</span>
                <span className={styles.bulan}>{row.bulan}</span>
                <span className={styles.nominal}>{fmt(row.nominal)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
