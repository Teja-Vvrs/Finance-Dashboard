import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { categories } from '../../data/transactions';
import { X } from 'lucide-react';

export default function TransactionModal({ transaction, onClose }) {
  const { addTransaction, updateTransaction, darkMode } = useApp();
  const isEditing = !!transaction;

  const [form, setForm] = useState({
    date: transaction?.date || new Date().toISOString().split('T')[0],
    description: transaction?.description || '',
    amount: transaction?.amount?.toString() || '',
    category: transaction?.category || categories[0],
    type: transaction?.type || 'expense',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      newErrors.amount = 'Enter a valid amount';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      date: form.date,
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
    };

    if (isEditing) {
      updateTransaction(transaction.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 rounded-lg border text-xs outline-none transition-all focus:ring-1 focus:ring-fin-teal/30 ${
      errors[field]
        ? 'border-fin-red'
        : darkMode
          ? 'border-dark-border bg-dark-surface text-dark-text'
          : 'border-light-border bg-light-bg text-light-text'
    } ${darkMode ? 'placeholder:text-dark-text-muted' : 'placeholder:text-light-text-muted'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className={`relative w-full max-w-md rounded-xl border shadow-2xl animate-scale-in ${
        darkMode
          ? 'bg-dark-card border-dark-border'
          : 'bg-light-card border-light-border'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3.5 border-b ${
          darkMode ? 'border-dark-border' : 'border-light-border'
        }`}>
          <h3 className={`text-sm font-bold ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h3>
          <button onClick={onClose} className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            darkMode ? 'hover:bg-dark-card-hover text-dark-text-muted' : 'hover:bg-light-card-hover text-light-text-muted'
          }`}>
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className={`block text-[9px] font-bold uppercase tracking-[2px] mb-1.5 ${
              darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
            }`}>Date</label>
            <input type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)} className={inputClass('date')} />
            {errors.date && <p className="text-fin-red text-[10px] mt-0.5">{errors.date}</p>}
          </div>

          <div>
            <label className={`block text-[9px] font-bold uppercase tracking-[2px] mb-1.5 ${
              darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
            }`}>Description</label>
            <input type="text" placeholder="Enter description" value={form.description} onChange={(e) => handleChange('description', e.target.value)} className={inputClass('description')} />
            {errors.description && <p className="text-fin-red text-[10px] mt-0.5">{errors.description}</p>}
          </div>

          <div>
            <label className={`block text-[9px] font-bold uppercase tracking-[2px] mb-1.5 ${
              darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
            }`}>Amount ($)</label>
            <input type="number" step="0.01" min="0" placeholder="0.00" value={form.amount} onChange={(e) => handleChange('amount', e.target.value)} className={inputClass('amount')} />
            {errors.amount && <p className="text-fin-red text-[10px] mt-0.5">{errors.amount}</p>}
          </div>

          <div>
            <label className={`block text-[9px] font-bold uppercase tracking-[2px] mb-1.5 ${
              darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
            }`}>Category</label>
            <select value={form.category} onChange={(e) => handleChange('category', e.target.value)} className={`w-full px-3.5 py-2.5 rounded-lg border text-xs outline-none cursor-pointer appearance-none transition-all focus:ring-1 focus:ring-fin-teal/30 ${
              darkMode ? 'border-dark-border bg-dark-surface text-dark-text' : 'border-light-border bg-light-bg text-light-text'
            }`}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className={`block text-[9px] font-bold uppercase tracking-[2px] mb-1.5 ${
              darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
            }`}>Type</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => handleChange('type', 'expense')} className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                form.type === 'expense'
                  ? 'bg-fin-red/12 border-fin-red/50 text-fin-red'
                  : darkMode ? 'border-dark-border text-dark-text-muted' : 'border-light-border text-light-text-muted'
              }`}>Expense</button>
              <button type="button" onClick={() => handleChange('type', 'income')} className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                form.type === 'income'
                  ? 'bg-fin-green/12 border-fin-green/50 text-fin-green'
                  : darkMode ? 'border-dark-border text-dark-text-muted' : 'border-light-border text-light-text-muted'
              }`}>Income</button>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
              darkMode ? 'border-dark-border text-dark-text-muted hover:bg-dark-card-hover' : 'border-light-border text-light-text-muted hover:bg-light-card-hover'
            }`}>Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-lg bg-fin-green text-dark-bg text-xs font-semibold hover:shadow-lg hover:shadow-fin-green/20 transition-all cursor-pointer">
              {isEditing ? 'Update' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
