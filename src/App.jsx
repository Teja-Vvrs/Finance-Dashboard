import { useApp } from './context/AppContext';
import Header from './components/Header';
import SummaryCards from './components/Dashboard/SummaryCards';
import BalanceTrend from './components/Dashboard/BalanceTrend';
import SpendingBreakdown from './components/Dashboard/SpendingBreakdown';
import InsightCards from './components/Insights/InsightCards';
import TransactionTable from './components/Transactions/TransactionTable';

function Dashboard() {
  const { darkMode } = useApp();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-dark-bg' : 'bg-light-bg'
    }`}>
      <Header />

      <main className="max-w-[1440px] mx-auto px-5 sm:px-8 py-6 space-y-7">
        {/* Dashboard Overview */}
        <SummaryCards />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BalanceTrend />
          <SpendingBreakdown />
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
        <footer className={`text-center py-6 text-[10px] tracking-wider uppercase ${
          darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
        }`}>
          © 2026 Finance Dashboard • Built with React & Tailwind CSS
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return <Dashboard />;
}
