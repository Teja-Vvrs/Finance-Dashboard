import { useApp } from '../../context/AppContext';
import { useMemo, useState } from 'react';
import { Zap, RefreshCw } from 'lucide-react';

function generateRoast(transactions, userName) {
  const first = userName?.split(' ')[0] || 'friend';

  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income');

  const totalIncome = income.reduce((s, t) => s + t.amount, 0);
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  // Category totals
  const catMap = {};
  expenses.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
  const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const top = sorted[0];
  const second = sorted[1];
  const bottom = sorted[sorted.length - 1];

  const dining = catMap['Dining'] || 0;
  const groceries = catMap['Groceries'] || 0;
  const entertainment = catMap['Entertainment'] || 0;
  const shopping = catMap['Shopping'] || 0;
  const healthcare = catMap['Healthcare'] || 0;
  const transport = catMap['Transportation'] || 0;
  const rent = catMap['Rent'] || 0;
  const utilities = catMap['Utilities'] || 0;

  const pool = [];

  // Savings rate roasts
  if (savingsRate >= 40) {
    pool.push({ text: `A ${savingsRate.toFixed(0)}% savings rate? ${first}, you're either very disciplined or very boring. Either way, respect.`, tone: 'praise' });
    pool.push({ text: `Saving ${savingsRate.toFixed(0)}% of your income. Your future self is already planning a thank-you speech.`, tone: 'praise' });
  } else if (savingsRate >= 20) {
    pool.push({ text: `${savingsRate.toFixed(0)}% savings rate — not bad, ${first}. Not "retire early" good, but not "ramen forever" bad either.`, tone: 'neutral' });
    pool.push({ text: `You're saving ${savingsRate.toFixed(0)}% this period. Solid. Now stop reading this and go invest it.`, tone: 'neutral' });
  } else if (savingsRate > 0) {
    pool.push({ text: `${savingsRate.toFixed(0)}% savings rate, ${first}. Your wallet is technically alive. Barely, but alive.`, tone: 'roast' });
    pool.push({ text: `You saved ${savingsRate.toFixed(0)}% of your income. Your bank account is giving you a slow clap.`, tone: 'roast' });
  } else {
    pool.push({ text: `Negative savings rate. Bold move, ${first}. Very bold.`, tone: 'roast' });
    pool.push({ text: `You spent more than you earned. Your future self would like a word.`, tone: 'roast' });
  }

  // Dining vs Groceries
  if (dining > 0 && groceries > 0) {
    const ratio = (dining / groceries).toFixed(1);
    if (dining > groceries * 2.5) {
      pool.push({ text: `You spent ${ratio}x more on Dining than Groceries. Bold strategy, chef. Gordon Ramsay would be confused.`, tone: 'roast' });
      pool.push({ text: `Dining: $${dining.toLocaleString()}. Groceries: $${groceries.toLocaleString()}. Your kitchen is basically a storage room at this point.`, tone: 'roast' });
    } else if (groceries > dining * 2) {
      pool.push({ text: `Groceries over Dining by a mile. Either you cook like a pro or you really hate waiters. Respect.`, tone: 'praise' });
    } else {
      pool.push({ text: `Dining and Groceries are neck and neck. You're living the balanced life — or just indecisive. Both valid.`, tone: 'neutral' });
    }
  }

  // Top category
  if (top) {
    if (top[0] === 'Shopping') {
      pool.push({ text: `$${top[1].toLocaleString()} on Shopping. ${first}, the economy thanks you personally.`, tone: 'roast' });
      pool.push({ text: `Shopping is your #1 expense. Your cart has never been more full. Your savings account has never been more empty.`, tone: 'roast' });
    } else if (top[0] === 'Entertainment') {
      pool.push({ text: `Entertainment is your biggest spend. You're not broke, you're just heavily invested in vibes.`, tone: 'roast' });
    } else if (top[0] === 'Salary' || top[0] === 'Rent') {
      // skip, not interesting
    } else if (top[0] === 'Healthcare') {
      pool.push({ text: `Healthcare is your top expense. Your body is your most expensive subscription. Worth it though.`, tone: 'neutral' });
    } else if (top[0] === 'Transportation') {
      pool.push({ text: `Transportation is eating your budget, ${first}. Have you considered… not going places?`, tone: 'roast' });
    } else if (top[0] === 'Utilities') {
      pool.push({ text: `Utilities on top. You're literally paying to exist. Respect the hustle.`, tone: 'neutral' });
    }
  }

  // Entertainment check
  if (entertainment > 200) {
    pool.push({ text: `$${entertainment.toLocaleString()} on Entertainment. You're not spending money, you're investing in happiness. (That's what we tell ourselves.)`, tone: 'roast' });
  }

  // Healthcare praise
  if (healthcare > 0 && healthcare < totalExpense * 0.1) {
    pool.push({ text: `Low healthcare spend. Either you're very healthy or very optimistic. Let's go with healthy.`, tone: 'praise' });
  }

  // Transport vs rent
  if (transport > 0 && rent > 0 && transport > rent) {
    pool.push({ text: `You spent more on Transportation than Rent. ${first}, where exactly are you going?`, tone: 'roast' });
  }

  // Income praise
  if (income.some(t => t.category === 'Freelance')) {
    pool.push({ text: `Freelance income detected. Look at you, building that side hustle. The grind is real.`, tone: 'praise' });
  }
  if (income.some(t => t.category === 'Investment')) {
    pool.push({ text: `Investment returns in the mix. ${first} is out here making money while sleeping. Respect.`, tone: 'praise' });
  }

  // Transaction count
  if (transactions.length > 50) {
    pool.push({ text: `${transactions.length} transactions logged. You're either very organised or have a serious spending habit. Possibly both.`, tone: 'neutral' });
  }

  // Fallback
  pool.push({ text: `Your finances are… a journey, ${first}. A beautiful, chaotic journey.`, tone: 'neutral' });
  pool.push({ text: `Data analysed. Verdict: you're doing fine. Probably. Don't quote us on that.`, tone: 'neutral' });

  // Pick a random one from the pool
  return pool[Math.floor(Math.random() * pool.length)];
}

const toneStyles = {
  roast: {
    icon: '🔥',
    label: 'ROAST',
    labelColor: 'text-fin-red',
    labelBg: 'bg-fin-red/10',
    border: 'border-fin-red/20',
    glow: 'shadow-fin-red/10',
  },
  praise: {
    icon: '✨',
    label: 'PRAISE',
    labelColor: 'text-fin-green',
    labelBg: 'bg-fin-green/10',
    border: 'border-fin-green/20',
    glow: 'shadow-fin-green/10',
  },
  neutral: {
    icon: '🤖',
    label: 'VERDICT',
    labelColor: 'text-fin-blue',
    labelBg: 'bg-fin-blue/10',
    border: 'border-fin-blue/20',
    glow: 'shadow-fin-blue/10',
  },
};

export default function SpendingRoast() {
  const { transactions, darkMode, user } = useApp();
  const [seed, setSeed] = useState(0);

  const roast = useMemo(
    () => generateRoast(transactions, user?.name),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions, user?.name, seed]
  );

  const style = toneStyles[roast.tone];

  return (
    <div className={`rounded-xl border shadow-lg px-5 py-4 flex items-center gap-4 animate-slide-up transition-all duration-300 ${
      darkMode
        ? `bg-dark-card ${style.border} ${style.glow}`
        : `bg-light-card ${style.border} ${style.glow}`
    }`}
    style={{ animationDelay: '150ms' }}
    >
      {/* Emoji */}
      <div className="text-3xl select-none shrink-0">{style.icon}</div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[9px] font-black uppercase tracking-[3px] px-2 py-0.5 rounded-full ${style.labelColor} ${style.labelBg}`}>
            {style.label}
          </span>
          <span className={`text-[9px] uppercase tracking-[2px] ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
            AI Analysis
          </span>
        </div>
        <p className={`text-sm font-medium leading-snug ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>
          {roast.text}
        </p>
      </div>

      {/* Refresh */}
      <button
        onClick={() => setSeed(s => s + 1)}
        title="Get another take"
        className={`p-2 rounded-lg shrink-0 transition-all cursor-pointer group ${
          darkMode
            ? 'hover:bg-dark-card-hover text-dark-text-muted hover:text-dark-text'
            : 'hover:bg-light-card-hover text-light-text-muted hover:text-light-text'
        }`}
      >
        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
      </button>
    </div>
  );
}
