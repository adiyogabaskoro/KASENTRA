import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './PeriodFilter.module.css';

const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
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

  const firstDay    = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const prevDays    = new Date(view.year, view.month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ d: prevDays - i, cur: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ d, cur: true });
  let nextD = 1;
  while (cells.length < 42) cells.push({ d: nextD++, cur: false });

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  let weekCounter = 0;
  const rowMeta = rows.map(row => {
    const hasCur = row.some(c => c.cur);
    if (hasCur && weekCounter < 4) { weekCounter++; return { hasCur: true, weekNum: weekCounter }; }
    return { hasCur: false, weekNum: null };
  });

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

// ── Cal Tahunan (range: tahun start → tahun end) ──────────────────────────────
function CalTahunan({ range, onSelect }) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [startYearView, setStartYearView] = useState(Math.floor(currentYear / 10) * 10);
  
  const years = Array.from({ length: 12 }, (_, i) => startYearView - 1 + i);
  const rows = [years.slice(0,4), years.slice(4,8), years.slice(8,12)];

  const handleClick = (yearPicked) => {
    if (!range.start || (range.start && range.end)) {
      onSelect({ start: yearPicked, end: null });
    } else {
      if (yearPicked < range.start) onSelect({ start: yearPicked, end: range.start });
      else onSelect({ start: range.start, end: yearPicked });
    }
  };

  return (
    <div className={styles.calBox} style={{ minWidth: 300 }}>
      <div className={styles.calHead}>
        <button className={styles.calNav} onClick={() => setStartYearView(y => y-10)}><ChevronLeft size={14}/></button>
        <span className={styles.calMonthLabel}>{startYearView} - {startYearView + 9}</span>
        <button className={styles.calNav} onClick={() => setStartYearView(y => y+10)}><ChevronRight size={14}/></button>
      </div>
      <div className={styles.monthGrid}>
        {rows.map((row, ri) => (
          <div key={ri} className={styles.monthRow}>
            {row.map((y, mi) => {
              const isSel   = y === range.start || y === range.end;
              const inRange = range.start != null && range.end != null && y > range.start && y < range.end;
              const isCur   = currentYear === y;
              return (
                <div key={mi}
                  className={[
                    styles.monthCell,
                    isSel ? styles.monthSel : '',
                    inRange ? styles.monthInRange : '',
                    isCur && !isSel ? styles.monthCur : '',
                  ].join(' ')}
                  onClick={() => handleClick(y)}
                >{y}</div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Exported Components ───────────────────────────────────────────────────────

export function PeriodeDropdown({ value, onChange }) {
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

export function DateFilterBtn({ periode, value, onChange }) {
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
    if (periode === 'Tahunan') {
      if (!value?.start) return 'Pilih Tahun';
      if (!value?.end)   return value.start.toString();
      if (value.start === value.end) return value.start.toString();
      return `${value.start} - ${value.end}`;
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
          {periode === 'Tahunan'  && <CalTahunan   range={value || { start:null, end:null }} onSelect={onChange} />}
        </div>
      )}
    </div>
  );
}
