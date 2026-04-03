import { useApp } from './context/AppContext';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import SummaryCards from './components/Dashboard/SummaryCards';
import BalanceTrend from './components/Dashboard/BalanceTrend';
import SpendingBreakdown from './components/Dashboard/SpendingBreakdown';
import MonthlyBarChart from './components/Dashboard/MonthlyBarChart';
import SpendingHeatmap from './components/Dashboard/SpendingHeatmap';
import InsightCards from './components/Insights/InsightCards';
import SpendingRoast from './components/Insights/SpendingRoast';
import TransactionTable from './components/Transactions/TransactionTable';
import Onboarding from './components/Onboarding';
import { ChevronUp } from 'lucide-react';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function Dashboard() {
  const { darkMode, user } = useApp();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-dark-bg' : 'bg-light-bg'
      }`}>
      <Header />

      <main className="max-w-[1440px] mx-auto px-5 sm:px-8 py-6 space-y-7">
        {/* Personalised greeting */}
        <div className="animate-fade-in">
          <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>
            Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className={`text-sm mt-1 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
            Here's a snapshot of your finances today.
          </p>
        </div>

        {/* AI Spending Roast */}
        <SpendingRoast />

        {/* Dashboard Overview */}
        <SummaryCards />

        {/* Charts row 1 — Balance + Spending Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BalanceTrend />
          <SpendingBreakdown />
        </div>

        {/* Charts row 2 — Monthly Bar + Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MonthlyBarChart />
          <SpendingHeatmap />
        </div>

        {/* Divider */}
        <div className={`border-t ${darkMode ? 'border-dark-border' : 'border-light-border'}`} />

        {/* Insights */}
        <InsightCards />

        {/* Divider */}
        <div className={`border-t ${darkMode ? 'border-dark-border' : 'border-light-border'}`} />

        {/* Transactions */}
        <TransactionTable />

        {/* Footer */}
        <footer className={`text-center py-6 text-[10px] tracking-wider uppercase ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
          }`}>
          © 2026 Finance Dashboard
        </footer>
      </main>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 p-2.5 rounded-xl border shadow-lg transition-all duration-300 cursor-pointer ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        } ${
          darkMode
            ? 'bg-dark-card border-dark-border text-fin-teal hover:bg-dark-card-hover hover:border-fin-teal/40 shadow-black/40'
            : 'bg-light-card border-light-border text-fin-teal hover:bg-light-card-hover hover:border-fin-teal/40 shadow-black/10'
        }`}
      >
        <ChevronUp size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default function App() {
  const { user } = useApp();
  return user ? <Dashboard /> : <Onboarding />;
}
