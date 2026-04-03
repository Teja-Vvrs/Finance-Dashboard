import { useApp } from '../../context/AppContext';
import { useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const RANGES = [
  { key: '1M', label: '1M', days: 30  },
  { key: '3M', label: '3M', days: 90  },
  { key: '6M', label: '6M', days: 180 },
  { key: '1Y', label: '1Y', days: 365 },
];

const rangeSubtitles = {
  '1M': 'Daily balance — last 30 days',
  '3M': 'Weekly balance — last 3 months',
  '6M': 'Monthly balance — last 6 months',
  '1Y': 'Monthly balance — 12-month overview',
};

export default function BalanceTrend() {
  const { transactions, darkMode } = useApp();
  const [range, setRange] = useState('1Y');

  const chartData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Build full running balance by date
    const dailyMap = {};
    let running = 0;
    sorted.forEach(t => {
      running += t.type === 'income' ? t.amount : -t.amount;
      dailyMap[t.date] = running;
    });

    // All dates sorted
    const allDates = Object.keys(dailyMap).sort();
    if (allDates.length === 0) return [];

    const lastDate = new Date(allDates[allDates.length - 1]);
    const { days } = RANGES.find(r => r.key === range);
    const cutoff = new Date(lastDate);
    cutoff.setDate(cutoff.getDate() - days);

    const filtered = allDates.filter(d => new Date(d) >= cutoff);

    if (range === '1M') {
      // Daily — show every date
      return filtered.map(date => ({
        label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance: dailyMap[date],
      }));
    }

    if (range === '3M') {
      // Weekly — keep one point per week (every 7th day)
      const weekly = [];
      let lastKept = null;
      filtered.forEach(date => {
        if (!lastKept || (new Date(date) - new Date(lastKept)) >= 6 * 86400000) {
          weekly.push({
            label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            balance: dailyMap[date],
          });
          lastKept = date;
        }
      });
      return weekly;
    }

    // 6M and 1Y — bucket by month, take last balance of each month
    const monthMap = {};
    filtered.forEach(date => {
      const d = new Date(date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap[key] = dailyMap[date]; // overwrites, so last date in month wins
    });

    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, balance]) => {
        const [year, month] = key.split('-');
        const label = new Date(Number(year), Number(month) - 1, 1)
          .toLocaleDateString('en-US', { month: 'short', year: range === '1Y' ? '2-digit' : undefined });
        return { label, balance };
      });
  }, [transactions, range]);

  const lineColor = '#00c9a7';

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={`px-3.5 py-2.5 rounded-lg border shadow-2xl ${
        darkMode ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
      }`}>
        <p className={`text-[10px] font-medium mb-0.5 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
          {label}
        </p>
        <p className={`text-sm font-bold ${payload[0].value >= 0 ? 'text-fin-teal' : 'text-fin-red'}`}>
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  };

  return (
    <div className={`rounded-xl border p-5 animate-slide-up ${
      darkMode ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
    }`} style={{ animationDelay: '250ms' }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-5 gap-3">
        <div>
          <h2 className={`text-[15px] font-bold ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>
            Balance Trend
          </h2>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
            {rangeSubtitles[range]}
          </p>
        </div>

        {/* Range buttons */}
        <div className={`flex items-center gap-0.5 p-0.5 rounded-lg border ${
          darkMode ? 'bg-dark-surface border-dark-border' : 'bg-light-bg border-light-border'
        }`}>
          {RANGES.map(r => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-150 cursor-pointer ${
                range === r.key
                  ? 'bg-fin-teal text-dark-bg shadow-sm'
                  : darkMode
                    ? 'text-dark-text-muted hover:text-dark-text'
                    : 'text-light-text-muted hover:text-light-text'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[260px] sm:h-[290px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -5, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={lineColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={darkMode ? '#1e1e28' : '#e2e2ea'}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              stroke={darkMode ? '#6e6e82' : '#6b7280'}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={8}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke={darkMode ? '#6e6e82' : '#6b7280'}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              dx={-3}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke={lineColor}
              strokeWidth={2}
              fill="url(#balanceGrad)"
              dot={false}
              activeDot={{
                r: 5,
                fill: lineColor,
                stroke: darkMode ? '#141419' : '#ffffff',
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
