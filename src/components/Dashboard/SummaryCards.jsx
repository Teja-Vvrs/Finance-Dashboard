import { useApp } from '../../context/AppContext';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useMemo } from 'react';

export default function SummaryCards() {
  const { transactions, totalBalance, totalIncome, totalExpenses, darkMode } = useApp();

  const { incomeChange, expenseChange } = useMemo(() => {
    const now = new Date('2026-04-02');
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth - 1;

    const thisMonthIncome = transactions
      .filter(t => t.type === 'income' && new Date(t.date).getMonth() === thisMonth)
      .reduce((s, t) => s + t.amount, 0);
    const lastMonthIncome = transactions
      .filter(t => t.type === 'income' && new Date(t.date).getMonth() === lastMonth)
      .reduce((s, t) => s + t.amount, 0);

    const thisMonthExpense = transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === thisMonth)
      .reduce((s, t) => s + t.amount, 0);
    const lastMonthExpense = transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === lastMonth)
      .reduce((s, t) => s + t.amount, 0);

    const incChange = lastMonthIncome > 0
      ? (((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100).toFixed(1)
      : thisMonthIncome > 0 ? '100.0' : '0.0';
    const expChange = lastMonthExpense > 0
      ? (((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100).toFixed(1)
      : thisMonthExpense > 0 ? '100.0' : '0.0';

    return { incomeChange: parseFloat(incChange), expenseChange: parseFloat(expChange) };
  }, [transactions]);

  const cards = [
    {
      title: 'Total Balance',
      value: totalBalance,
      icon: Wallet,
      valueColor: '',
      iconColor: 'text-dark-text-muted',
    },
    {
      title: 'Total Income',
      value: totalIncome,
      icon: TrendingUp,
      valueColor: 'text-fin-green',
      iconColor: 'text-fin-green',
      change: incomeChange,
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: TrendingDown,
      valueColor: 'text-fin-red',
      iconColor: 'text-fin-red',
      change: expenseChange,
    },
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className={`rounded-xl border p-5 transition-all duration-300 animate-slide-up ${
            darkMode
              ? 'bg-dark-card border-dark-border hover:border-dark-border-light'
              : 'bg-light-card border-light-border hover:shadow-md'
          }`}
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <p className={`text-[10px] font-bold uppercase tracking-[2px] ${
              darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
            }`}>
              {card.title}
            </p>
            <card.icon size={18} className={card.iconColor || (darkMode ? 'text-dark-text-muted' : 'text-light-text-muted')} strokeWidth={1.5} />
          </div>

          <p className={`text-3xl font-bold tracking-tight ${
            card.valueColor || (darkMode ? 'text-dark-text' : 'text-light-text')
          }`}>
            {formatCurrency(card.value)}
          </p>

          {card.change !== undefined && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {card.change >= 0 ? (
                <TrendingUp size={13} className="text-fin-green" />
              ) : (
                <TrendingDown size={13} className="text-fin-red" />
              )}
              <span className={`text-[11px] font-medium ${
                card.change >= 0 ? 'text-fin-green' : 'text-fin-red'
              }`}>
                {Math.abs(card.change)}% vs last month
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
