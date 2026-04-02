import { useApp } from '../../context/AppContext';
import { useMemo } from 'react';
import { BarChart3, TrendingDown, TrendingUp, CalendarDays } from 'lucide-react';

export default function InsightCards() {
  const { transactions, darkMode } = useApp();

  const insights = useMemo(() => {
    const now = new Date('2026-04-02');
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth - 1;

    // Top spending category
    const categorySpending = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      });

    const topCategory = Object.entries(categorySpending)
      .sort((a, b) => b[1] - a[1])[0] || ['None', 0];

    // Monthly expenses
    const thisMonthExpenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === thisMonth)
      .reduce((s, t) => s + t.amount, 0);
    const lastMonthExpenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === lastMonth)
      .reduce((s, t) => s + t.amount, 0);
    const expenseChange = lastMonthExpenses > 0
      ? (((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100).toFixed(1)
      : '0.0';

    // Monthly income
    const thisMonthIncome = transactions
      .filter(t => t.type === 'income' && new Date(t.date).getMonth() === thisMonth)
      .reduce((s, t) => s + t.amount, 0);
    const lastMonthIncome = transactions
      .filter(t => t.type === 'income' && new Date(t.date).getMonth() === lastMonth)
      .reduce((s, t) => s + t.amount, 0);
    const incomeChange = lastMonthIncome > 0
      ? (((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100).toFixed(1)
      : thisMonthIncome > 0 ? '100.0' : '-100.0';

    // Recent activity
    const sevenDaysAgo = new Date('2026-03-26');
    const recentCount = transactions
      .filter(t => new Date(t.date) >= sevenDaysAgo && new Date(t.date) <= now)
      .length;

    return [
      {
        title: 'Top Spending',
        value: topCategory[0],
        subtitle: `$${topCategory[1].toLocaleString()}`,
        icon: BarChart3,
        bgColor: 'bg-fin-pink',
      },
      {
        title: 'Monthly Expenses',
        value: `$${thisMonthExpenses.toLocaleString()}`,
        subtitle: `${Math.abs(parseFloat(expenseChange))}% ${parseFloat(expenseChange) <= 0 ? 'decrease' : 'increase'} from last month`,
        icon: TrendingDown,
        bgColor: 'bg-fin-amber',
      },
      {
        title: 'Monthly Income',
        value: `$${thisMonthIncome.toLocaleString()}`,
        subtitle: `${Math.abs(parseFloat(incomeChange))}% ${parseFloat(incomeChange) >= 0 ? 'increase' : 'decrease'} from last month`,
        icon: TrendingUp,
        bgColor: 'bg-fin-teal',
      },
      {
        title: 'Recent Activity',
        value: recentCount.toString(),
        subtitle: 'Transactions in last 7 days',
        icon: CalendarDays,
        bgColor: 'bg-fin-blue',
      },
    ];
  }, [transactions]);

  return (
    <div className="animate-slide-up" style={{ animationDelay: '450ms' }}>
      <div className="mb-5">
        <h2 className={`text-lg font-bold ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>
          Insights
        </h2>
        <p className={`text-xs mt-0.5 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
          Key observations from your financial data
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <div
            key={insight.title}
            className={`rounded-xl border p-5 transition-all duration-200 hover:scale-[1.015] ${
              darkMode
                ? 'bg-dark-card border-dark-border hover:border-dark-border-light'
                : 'bg-light-card border-light-border hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-3.5">
              {/* Square colored icon matching reference */}
              <div className={`w-11 h-11 rounded-lg ${insight.bgColor} flex items-center justify-center shrink-0 shadow-lg`}>
                <insight.icon size={20} className="text-white" strokeWidth={2} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-[9px] font-bold uppercase tracking-[2px] mb-1 ${
                  darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                }`}>
                  {insight.title}
                </p>
                <p className={`text-xl font-bold truncate leading-tight ${
                  darkMode ? 'text-dark-text' : 'text-light-text'
                }`}>
                  {insight.value}
                </p>
                <p className={`text-[11px] mt-1 leading-snug ${
                  darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                }`}>
                  {insight.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
