import { useApp } from '../../context/AppContext';
import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

export default function MonthlyBarChart() {
  const { transactions, darkMode } = useApp();

  const chartData = useMemo(() => {
    const monthMap = {};

    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap[key]) monthMap[key] = { income: 0, expense: 0 };
      if (t.type === 'income') monthMap[key].income += t.amount;
      else monthMap[key].expense += t.amount;
    });

    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // last 12 months
      .map(([key, vals]) => {
        const [year, month] = key.split('-');
        const label = new Date(Number(year), Number(month) - 1, 1)
          .toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        return {
          label,
          Income: vals.income,
          Expenses: vals.expense,
          net: vals.income - vals.expense,
        };
      });
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const income  = payload.find(p => p.dataKey === 'Income')?.value  || 0;
    const expense = payload.find(p => p.dataKey === 'Expenses')?.value || 0;
    const net = income - expense;
    return (
      <div className={`px-4 py-3 rounded-xl border shadow-2xl min-w-[150px] ${
        darkMode ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
      }`}>
        <p className={`text-[10px] font-bold uppercase tracking-[2px] mb-2 ${
          darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
        }`}>{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] text-fin-green font-medium">Income</span>
            <span className="text-[11px] text-fin-green font-bold">${income.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] text-fin-red font-medium">Expenses</span>
            <span className="text-[11px] text-fin-red font-bold">${expense.toLocaleString()}</span>
          </div>
          <div className={`border-t pt-1 mt-1 flex items-center justify-between gap-4 ${
            darkMode ? 'border-dark-border' : 'border-light-border'
          }`}>
            <span className={`text-[11px] font-medium ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>Net</span>
            <span className={`text-[11px] font-bold ${net >= 0 ? 'text-fin-teal' : 'text-fin-red'}`}>
              {net >= 0 ? '+' : ''}${net.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const CustomLegend = () => (
    <div className="flex items-center justify-center gap-5 mt-2">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm bg-fin-green" />
        <span className={`text-[11px] font-medium ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>Income</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm bg-fin-red" />
        <span className={`text-[11px] font-medium ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>Expenses</span>
      </div>
    </div>
  );

  return (
    <div className={`rounded-xl border p-5 animate-slide-up ${
      darkMode ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
    }`} style={{ animationDelay: '300ms' }}>
      <div className="mb-5">
        <h2 className={`text-[15px] font-bold ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>
          Income vs Expenses
        </h2>
        <p className={`text-xs mt-0.5 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
          Monthly comparison — last 12 months
        </p>
      </div>

      <div className="h-[260px] sm:h-[290px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -5, bottom: 0 }} barCategoryGap="30%">
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
              interval={0}
            />
            <YAxis
              stroke={darkMode ? '#6e6e82' : '#6b7280'}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              dx={-3}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: darkMode ? '#1a1a22' : '#f0f0f5', radius: 4 }} />
            <Bar dataKey="Income"  fill="#00d47e" radius={[3, 3, 0, 0]} maxBarSize={18} />
            <Bar dataKey="Expenses" fill="#ff4757" radius={[3, 3, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <CustomLegend />
    </div>
  );
}
