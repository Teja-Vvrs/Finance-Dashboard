import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { mockTransactions } from '../data/transactions';

const AppContext = createContext(null);

const STORAGE_KEY = 'finance_dashboard_data';

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }
  return null;
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

export function AppProvider({ children }) {
  const stored = loadFromStorage();

  const [transactions, setTransactions] = useState(stored?.transactions || mockTransactions);
  const [role, setRole] = useState(stored?.role || 'viewer');
  const [darkMode, setDarkMode] = useState(stored?.darkMode ?? true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    type: 'All',
    sortBy: 'date',
    sortOrder: 'asc',
  });

  const persist = useCallback((newTransactions, newRole, newDarkMode) => {
    saveToStorage({
      transactions: newTransactions,
      role: newRole,
      darkMode: newDarkMode,
    });
  }, []);

  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
    };
    setTransactions(prev => {
      const updated = [...prev, newTransaction];
      persist(updated, role, darkMode);
      return updated;
    });
  }, [role, darkMode, persist]);

  const updateTransaction = useCallback((id, updatedData) => {
    setTransactions(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updatedData } : t);
      persist(updated, role, darkMode);
      return updated;
    });
  }, [role, darkMode, persist]);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => {
      const updated = prev.filter(t => t.id !== id);
      persist(updated, role, darkMode);
      return updated;
    });
  }, [role, darkMode, persist]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const newVal = !prev;
      persist(transactions, role, newVal);
      return newVal;
    });
  }, [transactions, role, persist]);

  const switchRole = useCallback((newRole) => {
    setRole(newRole);
    persist(transactions, newRole, darkMode);
  }, [transactions, darkMode, persist]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      category: 'All',
      type: 'All',
      sortBy: 'date',
      sortOrder: 'asc',
    });
  }, []);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(search) ||
        t.category.toLowerCase().includes(search)
      );
    }

    if (filters.category !== 'All') {
      result = result.filter(t => t.category === filters.category);
    }

    if (filters.type !== 'All') {
      result = result.filter(t => t.type === filters.type);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (filters.sortBy === 'amount') {
        comparison = a.amount - b.amount;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [transactions, filters]);

  const totalIncome = useMemo(() =>
    transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(() =>
    transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalBalance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  const value = {
    transactions,
    filteredTransactions,
    role,
    darkMode,
    filters,
    totalIncome,
    totalExpenses,
    totalBalance,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    toggleDarkMode,
    switchRole,
    updateFilters,
    clearFilters,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
