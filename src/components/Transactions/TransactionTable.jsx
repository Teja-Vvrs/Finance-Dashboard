import { useApp } from '../../context/AppContext';
import { useState } from 'react';
import { categories } from '../../data/transactions';
import {
  Search, Filter, ArrowUpDown, Download, Plus, Pencil, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import TransactionModal from './TransactionModal';

// Category badge colors matching the reference
const badgeColors = {
  Salary: { bg: 'bg-fin-teal/15', text: 'text-fin-teal' },
  Rent: { bg: 'bg-fin-amber/15', text: 'text-fin-amber' },
  Groceries: { bg: 'bg-fin-orange/15', text: 'text-fin-orange' },
  Dining: { bg: 'bg-fin-red/15', text: 'text-fin-red' },
  Transportation: { bg: 'bg-fin-blue/15', text: 'text-fin-blue' },
  Entertainment: { bg: 'bg-fin-purple/15', text: 'text-fin-purple' },
  Utilities: { bg: 'bg-fin-teal/15', text: 'text-fin-teal' },
  Shopping: { bg: 'bg-fin-pink/15', text: 'text-fin-pink' },
  Healthcare: { bg: 'bg-fin-cyan/15', text: 'text-fin-cyan' },
  Education: { bg: 'bg-fin-magenta/15', text: 'text-fin-magenta' },
  Freelance: { bg: 'bg-fin-green/15', text: 'text-fin-green' },
  Investment: { bg: 'bg-fin-purple/15', text: 'text-fin-purple' },
};

export default function TransactionTable() {
  const {
    filteredTransactions, filters, updateFilters, clearFilters,
    role, darkMode, deleteTransaction,
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIdx, startIdx + itemsPerPage);

  const handleSort = (field) => {
    if (filters.sortBy === field) {
      updateFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      updateFilters({ sortBy: field, sortOrder: 'asc' });
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  const handleExport = (format) => {
    const data = filteredTransactions;
    let content, filename, mimeType;

    if (format === 'csv') {
      const headers = 'Date,Description,Category,Type,Amount\n';
      const rows = data.map(t =>
        `${t.date},"${t.description}",${t.category},${t.type},${t.type === 'expense' ? '-' : '+'}${t.amount}`
      ).join('\n');
      content = headers + rows;
      filename = 'transactions.csv';
      mimeType = 'text/csv';
    } else {
      content = JSON.stringify(data, null, 2);
      filename = 'transactions.json';
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return <ArrowUpDown size={12} className="opacity-30" />;
    return filters.sortOrder === 'asc' ? (
      <ChevronUp size={12} className="text-fin-green" />
    ) : (
      <ChevronDown size={12} className="text-fin-green" />
    );
  };

  return (
    <div className="animate-slide-up" style={{ animationDelay: '550ms' }}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className={`text-lg font-bold ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>
            Transactions
          </h2>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
            {filteredTransactions.length} transactions found
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export */}
          <div className="relative group">
            <button
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                darkMode
                  ? 'border-dark-border bg-dark-card hover:bg-dark-card-hover text-dark-text-secondary'
                  : 'border-light-border bg-light-card hover:bg-light-card-hover text-light-text'
              }`}
            >
              <Download size={14} />
              Export
            </button>
            <div className={`absolute right-0 top-full mt-1.5 py-1 rounded-lg border shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[110px] ${
              darkMode
                ? 'bg-dark-card border-dark-border'
                : 'bg-light-card border-light-border'
            }`}>
              <button onClick={() => handleExport('csv')} className={`w-full px-3 py-1.5 text-xs text-left cursor-pointer transition-colors ${darkMode ? 'text-dark-text hover:bg-dark-card-hover' : 'text-light-text hover:bg-light-card-hover'}`}>
                Export CSV
              </button>
              <button onClick={() => handleExport('json')} className={`w-full px-3 py-1.5 text-xs text-left cursor-pointer transition-colors ${darkMode ? 'text-dark-text hover:bg-dark-card-hover' : 'text-light-text hover:bg-light-card-hover'}`}>
                Export JSON
              </button>
            </div>
          </div>

          {/* Add (Admin Only) */}
          {role === 'admin' && (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-fin-green text-dark-bg text-xs font-semibold hover:shadow-lg hover:shadow-fin-green/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Plus size={14} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters Row - matching reference layout */}
      <div className={`rounded-xl border p-3.5 mb-4 ${
        darkMode ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
      }`}>
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
            }`} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => { updateFilters({ search: e.target.value }); setCurrentPage(1); }}
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs outline-none transition-all focus:ring-1 focus:ring-fin-teal/30 ${
                darkMode
                  ? 'bg-dark-surface border-dark-border text-dark-text placeholder:text-dark-text-muted'
                  : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'
              }`}
            />
          </div>

          {/* Category */}
          <div className="relative">
            <Filter size={12} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${
              darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
            }`} />
            <select
              value={filters.category}
              onChange={(e) => { updateFilters({ category: e.target.value }); setCurrentPage(1); }}
              className={`pl-8 pr-6 py-2 rounded-lg border text-xs outline-none cursor-pointer appearance-none transition-all focus:ring-1 focus:ring-fin-teal/30 ${
                darkMode
                  ? 'bg-dark-surface border-dark-border text-dark-text'
                  : 'bg-light-bg border-light-border text-light-text'
              }`}
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <select
            value={filters.type}
            onChange={(e) => { updateFilters({ type: e.target.value }); setCurrentPage(1); }}
            className={`px-3 py-2 rounded-lg border text-xs outline-none cursor-pointer appearance-none transition-all focus:ring-1 focus:ring-fin-teal/30 ${
              darkMode
                ? 'bg-dark-surface border-dark-border text-dark-text'
                : 'bg-light-bg border-light-border text-light-text'
            }`}
          >
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Clear */}
          <button
            onClick={() => { clearFilters(); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              darkMode
                ? 'bg-dark-surface text-dark-text-muted hover:text-dark-text hover:bg-dark-card-hover'
                : 'bg-light-bg text-light-text-muted hover:text-light-text hover:bg-light-card-hover'
            }`}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden ${
        darkMode ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-dark-border' : 'border-light-border'}`}>
                <th
                  className={`text-left px-4 py-3 text-[9px] font-bold uppercase tracking-[2px] cursor-pointer select-none ${
                    darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                  }`}
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date <SortIcon field="date" />
                  </div>
                </th>
                <th className={`text-left px-4 py-3 text-[9px] font-bold uppercase tracking-[2px] ${
                  darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                }`}>
                  Description
                </th>
                <th className={`text-left px-4 py-3 text-[9px] font-bold uppercase tracking-[2px] ${
                  darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                }`}>
                  Category
                </th>
                <th className={`text-left px-4 py-3 text-[9px] font-bold uppercase tracking-[2px] ${
                  darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                }`}>
                  Type
                </th>
                <th
                  className={`text-right px-4 py-3 text-[9px] font-bold uppercase tracking-[2px] cursor-pointer select-none ${
                    darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                  }`}
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Amount <SortIcon field="amount" />
                  </div>
                </th>
                {role === 'admin' && (
                  <th className={`text-right px-4 py-3 text-[9px] font-bold uppercase tracking-[2px] ${
                    darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                  }`}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={role === 'admin' ? 6 : 5} className="text-center py-14">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className={darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'} />
                      <p className={`text-sm font-medium ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                        No transactions found
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((transaction) => {
                  const badge = badgeColors[transaction.category] || { bg: 'bg-dark-border', text: 'text-dark-text-muted' };
                  return (
                    <tr
                      key={transaction.id}
                      className={`border-b last:border-b-0 transition-colors ${
                        darkMode
                          ? 'border-dark-border hover:bg-dark-card-hover'
                          : 'border-light-border hover:bg-light-card-hover'
                      }`}
                    >
                      <td className={`px-4 py-3 text-xs ${
                        darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                      }`}>
                        {formatDate(transaction.date)}
                      </td>
                      <td className={`px-4 py-3 text-xs font-medium ${
                        transaction.type === 'income' ? 'text-fin-green' : (darkMode ? 'text-dark-text' : 'text-light-text')
                      }`}>
                        {transaction.description}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold ${badge.bg} ${badge.text}`}>
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                          transaction.type === 'income'
                            ? 'bg-fin-green/12 text-fin-green'
                            : 'bg-fin-red/12 text-fin-red'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-xs font-semibold text-right ${
                        transaction.type === 'income' ? 'text-fin-green' : 'text-fin-red'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </td>
                      {role === 'admin' && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-0.5">
                            <button
                              onClick={() => handleEdit(transaction)}
                              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                darkMode
                                  ? 'hover:bg-fin-blue/10 text-dark-text-muted hover:text-fin-blue'
                                  : 'hover:bg-fin-blue/10 text-light-text-muted hover:text-fin-blue'
                              }`}
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => deleteTransaction(transaction.id)}
                              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                darkMode
                                  ? 'hover:bg-fin-red/10 text-dark-text-muted hover:text-fin-red'
                                  : 'hover:bg-fin-red/10 text-light-text-muted hover:text-fin-red'
                              }`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`flex items-center justify-between px-4 py-3 border-t ${
            darkMode ? 'border-dark-border' : 'border-light-border'
          }`}>
            <p className={`text-[11px] ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
              Showing {startIdx + 1}–{Math.min(startIdx + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
            </p>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                  darkMode ? 'hover:bg-dark-card-hover text-dark-text-muted' : 'hover:bg-light-card-hover text-light-text-muted'
                }`}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    page === currentPage
                      ? 'bg-fin-green text-dark-bg'
                      : darkMode
                        ? 'hover:bg-dark-card-hover text-dark-text-muted'
                        : 'hover:bg-light-card-hover text-light-text-muted'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                  darkMode ? 'hover:bg-dark-card-hover text-dark-text-muted' : 'hover:bg-light-card-hover text-light-text-muted'
                }`}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => { setShowModal(false); setEditingTransaction(null); }}
        />
      )}
    </div>
  );
}
