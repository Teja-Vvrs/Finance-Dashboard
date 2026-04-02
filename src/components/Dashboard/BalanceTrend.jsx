import { useApp } from '../../context/AppContext';
import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function BalanceTrend() {
  const { transactions, darkMode } = useApp();

  const chartData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const dailyMap = {};
    let runningBalance = 0;

    sorted.forEach(t => {
      const dateStr = t.date;
      if (t.type === 'income') {
        runningBalance += t.amount;
      } else {
        runningBalance -= t.amount;
      }
      dailyMap[dateStr] = runningBalance;
    });

    return Object.entries(dailyMap).map(([date, balance]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      balance,
      fullDate: date,
    }));
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`px-3.5 py-2.5 rounded-lg border shadow-2xl ${
          darkMode
            ? 'bg-dark-card border-dark-border'
            : 'bg-light-card border-light-border'
        }`}>
          <p className={`text-[10px] font-medium mb-0.5 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
            {label}
          </p>
          <p className={`text-sm font-bold ${
            payload[0].value >= 0 ? 'text-fin-green' : 'text-fin-red'
          }`}>
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-xl border p-5 animate-slide-up ${
      darkMode
        ? 'bg-dark-card border-dark-border'
        : 'bg-light-card border-light-border'
    }`} style={{ animationDelay: '250ms' }}>
      <div className="mb-5">
        <h2 className={`text-[15px] font-bold ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>
          Balance Trend
        </h2>
        <p className={`text-xs mt-0.5 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
          Last 30 days performance
        </p>
      </div>

      <div className="h-[260px] sm:h-[290px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -5, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={darkMode ? '#1e1e28' : '#e2e2ea'}
              vertical={false}
            />
            <XAxis
              dataKey="date"
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
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              dx={-3}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="balance"
              stroke={darkMode ? '#e8e8f0' : '#12121a'}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 5,
                fill: darkMode ? '#e8e8f0' : '#12121a',
                stroke: darkMode ? '#141419' : '#ffffff',
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
