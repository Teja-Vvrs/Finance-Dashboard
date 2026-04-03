import { useApp } from '../../context/AppContext';
import { useMemo, useState } from 'react';

// Build a 53-week × 7-day grid like GitHub contributions
function buildGrid(transactions) {
  // Daily spend totals
  const dayMap = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      dayMap[t.date] = (dayMap[t.date] || 0) + t.amount;
    });

  // Find date range: last 52 weeks ending today
  const today = new Date('2026-04-03'); // pinned to demo date
  const end = new Date(today);
  // go back to last Saturday so grid starts on Sunday
  const startDow = end.getDay(); // 0=Sun
  end.setDate(end.getDate() + (6 - startDow)); // push to next Saturday

  const start = new Date(end);
  start.setDate(start.getDate() - 52 * 7 + 1);

  // Build weeks array
  const weeks = [];
  let current = new Date(start);

  while (current <= end) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const iso = current.toISOString().split('T')[0];
      week.push({
        date: iso,
        amount: dayMap[iso] || 0,
        dow: current.getDay(),
        month: current.getMonth(),
        day: current.getDate(),
      });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  // Max spend for intensity scaling
  const max = Math.max(...Object.values(dayMap), 1);

  return { weeks, max };
}

function getIntensity(amount, max) {
  if (amount === 0) return 0;
  const ratio = amount / max;
  if (ratio < 0.15) return 1;
  if (ratio < 0.35) return 2;
  if (ratio < 0.6)  return 3;
  return 4;
}

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOW_LABELS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function SpendingHeatmap() {
  const { transactions, darkMode } = useApp();
  const [tooltip, setTooltip] = useState(null);

  const { weeks, max } = useMemo(() => buildGrid(transactions), [transactions]);

  // Intensity → color (dark mode: teal scale, light mode: teal scale lighter)
  const cellColor = (intensity) => {
    if (darkMode) {
      switch (intensity) {
        case 0: return '#1a1a22';
        case 1: return '#003d30';
        case 2: return '#006650';
        case 3: return '#009970';
        case 4: return '#00d47e';
        default: return '#1a1a22';
      }
    } else {
      switch (intensity) {
        case 0: return '#e8e8f0';
        case 1: return '#b2f0dc';
        case 2: return '#5dd9b0';
        case 3: return '#00c9a7';
        case 4: return '#00a882';
        default: return '#e8e8f0';
      }
    }
  };

  // Month label positions — find first week where month changes
  const monthPositions = [];
  weeks.forEach((week, wi) => {
    const firstDay = week.find(d => d.day === 1 || (wi === 0 && d.dow === 0));
    if (firstDay && (wi === 0 || weeks[wi - 1]?.every(d => d.month !== firstDay.month))) {
      monthPositions.push({ wi, label: MONTH_LABELS[firstDay.month] });
    }
  });

  const CELL = 13; // cell size px
  const GAP  = 2;  // gap px

  return (
    <div className={`rounded-xl border p-5 animate-slide-up ${
      darkMode ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
    }`} style={{ animationDelay: '400ms' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className={`text-[15px] font-bold ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>
            Spending Heatmap
          </h2>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
            Daily spend intensity — last 52 weeks
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>Less</span>
          {[0,1,2,3,4].map(i => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: cellColor(i) }}
            />
          ))}
          <span className={`text-[10px] ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>More</span>
        </div>
      </div>

      {/* Grid wrapper — scrollable on small screens */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1 min-w-max">
          {/* Day-of-week labels */}
          <div className="flex flex-col gap-[2px] mr-1" style={{ paddingTop: `${CELL + GAP + 4}px` }}>
            {DOW_LABELS.map((d, i) => (
              <div
                key={d}
                className={`text-[9px] leading-none flex items-center ${
                  darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                }`}
                style={{ height: CELL, visibility: i % 2 === 1 ? 'visible' : 'hidden' }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex flex-col">
            {/* Month labels row */}
            <div className="flex mb-1" style={{ height: CELL }}>
              {weeks.map((_, wi) => {
                const mp = monthPositions.find(m => m.wi === wi);
                return (
                  <div
                    key={wi}
                    className={`text-[9px] leading-none flex items-end pb-0.5 ${
                      darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                    }`}
                    style={{ width: CELL + GAP, minWidth: CELL + GAP }}
                  >
                    {mp ? mp.label : ''}
                  </div>
                );
              })}
            </div>

            {/* Cell grid */}
            <div className="flex gap-[2px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.map((cell) => {
                    const intensity = getIntensity(cell.amount, max);
                    return (
                      <div
                        key={cell.date}
                        className="rounded-sm cursor-pointer transition-all duration-100 hover:ring-1 hover:ring-fin-teal/60 hover:scale-110"
                        style={{
                          width: CELL,
                          height: CELL,
                          backgroundColor: cellColor(intensity),
                        }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({ cell, x: rect.left, y: rect.top });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip — fixed position */}
      {tooltip && (
        <div
          className={`fixed z-50 px-3 py-2 rounded-lg border shadow-2xl pointer-events-none text-left ${
            darkMode ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
          }`}
          style={{ left: tooltip.x + 18, top: tooltip.y - 10 }}
        >
          <p className={`text-[10px] font-medium ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
            {new Date(tooltip.cell.date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
            })}
          </p>
          <p className={`text-sm font-bold mt-0.5 ${
            tooltip.cell.amount > 0 ? 'text-fin-red' : (darkMode ? 'text-dark-text-muted' : 'text-light-text-muted')
          }`}>
            {tooltip.cell.amount > 0 ? `$${tooltip.cell.amount.toLocaleString()} spent` : 'No spending'}
          </p>
        </div>
      )}
    </div>
  );
}
