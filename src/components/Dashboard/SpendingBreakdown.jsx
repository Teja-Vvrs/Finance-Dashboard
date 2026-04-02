import { useApp } from '../../context/AppContext';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { categoryColors } from '../../data/transactions';

const pieColors = {
  Dining: '#ff4757',
  Education: '#ff6b9d',
  Entertainment: '#e91e8b',
  Groceries: '#ffc107',
  Healthcare: '#00c9a7',
  Shopping: '#8c8c9a',
  Transportation: '#4a7dff',
  Utilities: '#00d47e',
  Rent: '#ff8c42',
};

export default function SpendingBreakdown() {
  const { transactions, darkMode } = useApp();

  const chartData = useMemo(() => {
    const categoryMap = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = useMemo(() => chartData.reduce((s, d) => s + d.value, 0), [chartData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = ((data.value / total) * 100).toFixed(1);
      return (
        <div className={`px-3.5 py-2.5 rounded-lg border shadow-2xl ${darkMode
            ? 'bg-dark-card border-dark-border'
            : 'bg-light-card border-light-border'
          }`}>
          <p className={`text-[10px] font-medium mb-0.5 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
            {data.name}
          </p>
          <p className="text-sm font-bold text-fin-red">
            ${data.value.toLocaleString()}
          </p>
          <p className={`text-[10px] mt-0.5 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
            {percent}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-xl border p-5 animate-slide-up ${darkMode
        ? 'bg-dark-card border-dark-border'
        : 'bg-light-card border-light-border'
      }`} style={{ animationDelay: '350ms' }}>
      <div className="mb-5">
        <h2 className={`text-[15px] font-bold ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>
          Spending Breakdown
        </h2>
        <p className={`text-xs mt-0.5 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
          Expenses by category
        </p>
      </div>

      <div className="flex flex-col items-center gap-5">
        {/* Full PIE chart - not donut - matching reference */}
        <div className="h-[220px] w-full max-w-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                paddingAngle={1}
                dataKey="value"
                stroke={darkMode ? '#141419' : '#ffffff'}
                strokeWidth={2}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={pieColors[entry.name] || categoryColors[entry.name] || '#6b7280'}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend matching reference - horizontal with dots */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
          {chartData.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-1.5"
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: pieColors[item.name] || categoryColors[item.name] || '#6b7280' }}
              />
              <span className={`text-[11px] ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                }`}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
