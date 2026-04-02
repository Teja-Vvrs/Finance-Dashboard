const categories = [
  'Salary', 'Rent', 'Groceries', 'Dining', 'Transportation',
  'Entertainment', 'Utilities', 'Shopping', 'Healthcare', 'Education',
  'Freelance', 'Investment'
];

const descriptions = {
  Salary: ['Monthly Salary', 'Annual Increment', 'Bonus Payment', 'Overtime Pay'],
  Rent: ['Apartment Rent', 'Monthly Rent', 'Parking Space Rent'],
  Groceries: ['Grocery Store', 'Fresh Market', 'Organic Produce', 'Weekly Groceries'],
  Dining: ['Restaurant Dinner', 'Coffee Shop', 'Lunch Meeting', 'Fast Food', 'Brunch'],
  Transportation: ['Gas Station', 'Uber Ride', 'Metro Card', 'Parking Fee', 'Car Wash'],
  Entertainment: ['Movie Tickets', 'Netflix Subscription', 'Concert Tickets', 'Gaming Purchase', 'Spotify'],
  Utilities: ['Electricity Bill', 'Water Bill', 'Internet Bill', 'Phone Bill', 'Gas Bill'],
  Shopping: ['Online Shopping', 'Clothing Store', 'Electronics', 'Home Decor', 'Gift Purchase'],
  Healthcare: ['Doctor Visit', 'Pharmacy', 'Gym Membership', 'Dental Checkup', 'Health Insurance'],
  Education: ['Online Course', 'Book Purchase', 'Workshop Fee', 'Certification Exam'],
  Freelance: ['Freelance Project', 'Consulting Fee', 'Design Work', 'Web Development'],
  Investment: ['Stock Dividend', 'Investment Return', 'Interest Income'],
};

const categoryColors = {
  Salary: '#10b981',
  Rent: '#ef4444',
  Groceries: '#f59e0b',
  Dining: '#ec4899',
  Transportation: '#3b82f6',
  Entertainment: '#8b5cf6',
  Utilities: '#14b8a6',
  Shopping: '#6b7280',
  Healthcare: '#06b6d4',
  Education: '#f97316',
  Freelance: '#22c55e',
  Investment: '#a855f7',
};

function generateTransactions() {
  const transactions = [];
  let id = 1;

  const incomeCategories = ['Salary', 'Freelance', 'Investment'];
  const expenseCategories = ['Rent', 'Groceries', 'Dining', 'Transportation', 'Entertainment', 'Utilities', 'Shopping', 'Healthcare', 'Education'];

  // Generate transactions from Jan 2026 to Apr 2026
  for (let month = 0; month < 4; month++) {
    const year = 2026;
    const m = month; // 0=Jan, 1=Feb, 2=Mar, 3=Apr

    // Monthly salary
    transactions.push({
      id: id++,
      date: `2026-${String(m + 1).padStart(2, '0')}-08`,
      description: 'Monthly Salary',
      amount: 2791,
      category: 'Salary',
      type: 'income',
    });

    // Second income (freelance or bonus)
    if (m % 2 === 0) {
      const cat = incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
      const descs = descriptions[cat];
      transactions.push({
        id: id++,
        date: `2026-${String(m + 1).padStart(2, '0')}-${String(15 + Math.floor(Math.random() * 10)).padStart(2, '0')}`,
        description: descs[Math.floor(Math.random() * descs.length)],
        amount: 500 + Math.floor(Math.random() * 2000),
        category: cat,
        type: 'income',
      });
    }

    // Annual increment in Jan
    if (m === 0) {
      transactions.push({
        id: id++,
        date: '2026-01-06',
        description: 'Annual Increment',
        amount: 2148,
        category: 'Salary',
        type: 'income',
      });
    }

    // Expenses - generate 8-12 per month
    const numExpenses = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < numExpenses; i++) {
      const cat = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      const descs = descriptions[cat];
      const day = 1 + Math.floor(Math.random() * 28);

      let amount;
      switch (cat) {
        case 'Rent': amount = 179 + Math.floor(Math.random() * 50); break;
        case 'Groceries': amount = 45 + Math.floor(Math.random() * 120); break;
        case 'Dining': amount = 15 + Math.floor(Math.random() * 85); break;
        case 'Transportation': amount = 25 + Math.floor(Math.random() * 350); break;
        case 'Entertainment': amount = 10 + Math.floor(Math.random() * 100); break;
        case 'Utilities': amount = 50 + Math.floor(Math.random() * 200); break;
        case 'Shopping': amount = 30 + Math.floor(Math.random() * 300); break;
        case 'Healthcare': amount = 25 + Math.floor(Math.random() * 250); break;
        case 'Education': amount = 20 + Math.floor(Math.random() * 150); break;
        default: amount = 50 + Math.floor(Math.random() * 200);
      }

      transactions.push({
        id: id++,
        date: `2026-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        description: descs[Math.floor(Math.random() * descs.length)],
        amount,
        category: cat,
        type: 'expense',
      });
    }
  }

  // Sort by date
  transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
  return transactions;
}

// Use a seeded-like approach with fixed data for consistency
const mockTransactions = [
  { id: 1, date: '2026-01-02', description: 'Weekly Groceries', amount: 87, category: 'Groceries', type: 'expense' },
  { id: 2, date: '2026-01-03', description: 'Coffee Shop', amount: 24, category: 'Dining', type: 'expense' },
  { id: 3, date: '2026-01-04', description: 'Gas Station', amount: 376, category: 'Transportation', type: 'expense' },
  { id: 4, date: '2026-01-05', description: 'Electricity Bill', amount: 142, category: 'Utilities', type: 'expense' },
  { id: 5, date: '2026-01-06', description: 'Annual Increment', amount: 2148, category: 'Salary', type: 'income' },
  { id: 6, date: '2026-01-07', description: 'Apartment Rent', amount: 179, category: 'Rent', type: 'expense' },
  { id: 7, date: '2026-01-08', description: 'Monthly Salary', amount: 2791, category: 'Salary', type: 'income' },
  { id: 8, date: '2026-01-09', description: 'Monthly Rent', amount: 179, category: 'Rent', type: 'expense' },
  { id: 9, date: '2026-01-10', description: 'Netflix Subscription', amount: 15, category: 'Entertainment', type: 'expense' },
  { id: 10, date: '2026-01-11', description: 'Online Shopping', amount: 235, category: 'Shopping', type: 'expense' },
  { id: 11, date: '2026-01-12', description: 'Gym Membership', amount: 45, category: 'Healthcare', type: 'expense' },
  { id: 12, date: '2026-01-14', description: 'Restaurant Dinner', amount: 67, category: 'Dining', type: 'expense' },
  { id: 13, date: '2026-01-15', description: 'Freelance Project', amount: 1500, category: 'Freelance', type: 'income' },
  { id: 14, date: '2026-01-17', description: 'Internet Bill', amount: 89, category: 'Utilities', type: 'expense' },
  { id: 15, date: '2026-01-18', description: 'Fresh Market', amount: 56, category: 'Groceries', type: 'expense' },
  { id: 16, date: '2026-01-20', description: 'Uber Ride', amount: 32, category: 'Transportation', type: 'expense' },
  { id: 17, date: '2026-01-22', description: 'Book Purchase', amount: 28, category: 'Education', type: 'expense' },
  { id: 18, date: '2026-01-24', description: 'Phone Bill', amount: 65, category: 'Utilities', type: 'expense' },
  { id: 19, date: '2026-01-25', description: 'Movie Tickets', amount: 30, category: 'Entertainment', type: 'expense' },
  { id: 20, date: '2026-01-27', description: 'Doctor Visit', amount: 120, category: 'Healthcare', type: 'expense' },

  // February
  { id: 21, date: '2026-02-01', description: 'Water Bill', amount: 45, category: 'Utilities', type: 'expense' },
  { id: 22, date: '2026-02-03', description: 'Grocery Store', amount: 134, category: 'Groceries', type: 'expense' },
  { id: 23, date: '2026-02-04', description: 'Parking Fee', amount: 18, category: 'Transportation', type: 'expense' },
  { id: 24, date: '2026-02-05', description: 'Lunch Meeting', amount: 48, category: 'Dining', type: 'expense' },
  { id: 25, date: '2026-02-06', description: 'Clothing Store', amount: 189, category: 'Shopping', type: 'expense' },
  { id: 26, date: '2026-02-08', description: 'Monthly Salary', amount: 2791, category: 'Salary', type: 'income' },
  { id: 27, date: '2026-02-09', description: 'Apartment Rent', amount: 179, category: 'Rent', type: 'expense' },
  { id: 28, date: '2026-02-10', description: 'Spotify', amount: 12, category: 'Entertainment', type: 'expense' },
  { id: 29, date: '2026-02-12', description: 'Gas Bill', amount: 78, category: 'Utilities', type: 'expense' },
  { id: 30, date: '2026-02-14', description: 'Restaurant Dinner', amount: 95, category: 'Dining', type: 'expense' },
  { id: 31, date: '2026-02-15', description: 'Online Course', amount: 49, category: 'Education', type: 'expense' },
  { id: 32, date: '2026-02-17', description: 'Pharmacy', amount: 34, category: 'Healthcare', type: 'expense' },
  { id: 33, date: '2026-02-19', description: 'Metro Card', amount: 50, category: 'Transportation', type: 'expense' },
  { id: 34, date: '2026-02-20', description: 'Stock Dividend', amount: 320, category: 'Investment', type: 'income' },
  { id: 35, date: '2026-02-22', description: 'Electronics', amount: 299, category: 'Shopping', type: 'expense' },
  { id: 36, date: '2026-02-24', description: 'Organic Produce', amount: 72, category: 'Groceries', type: 'expense' },
  { id: 37, date: '2026-02-26', description: 'Concert Tickets', amount: 85, category: 'Entertainment', type: 'expense' },
  { id: 38, date: '2026-02-28', description: 'Dental Checkup', amount: 175, category: 'Healthcare', type: 'expense' },

  // March
  { id: 39, date: '2026-03-01', description: 'Electricity Bill', amount: 156, category: 'Utilities', type: 'expense' },
  { id: 40, date: '2026-03-03', description: 'Brunch', amount: 42, category: 'Dining', type: 'expense' },
  { id: 41, date: '2026-03-04', description: 'Car Wash', amount: 25, category: 'Transportation', type: 'expense' },
  { id: 42, date: '2026-03-05', description: 'Gift Purchase', amount: 150, category: 'Shopping', type: 'expense' },
  { id: 43, date: '2026-03-06', description: 'Consulting Fee', amount: 850, category: 'Freelance', type: 'income' },
  { id: 44, date: '2026-03-08', description: 'Monthly Salary', amount: 2791, category: 'Salary', type: 'income' },
  { id: 45, date: '2026-03-09', description: 'Monthly Rent', amount: 179, category: 'Rent', type: 'expense' },
  { id: 46, date: '2026-03-10', description: 'Netflix Subscription', amount: 15, category: 'Entertainment', type: 'expense' },
  { id: 47, date: '2026-03-12', description: 'Weekly Groceries', amount: 98, category: 'Groceries', type: 'expense' },
  { id: 48, date: '2026-03-14', description: 'Workshop Fee', amount: 75, category: 'Education', type: 'expense' },
  { id: 49, date: '2026-03-15', description: 'Health Insurance', amount: 200, category: 'Healthcare', type: 'expense' },
  { id: 50, date: '2026-03-17', description: 'Fast Food', amount: 19, category: 'Dining', type: 'expense' },
  { id: 51, date: '2026-03-19', description: 'Uber Ride', amount: 28, category: 'Transportation', type: 'expense' },
  { id: 52, date: '2026-03-20', description: 'Internet Bill', amount: 89, category: 'Utilities', type: 'expense' },
  { id: 53, date: '2026-03-22', description: 'Home Decor', amount: 120, category: 'Shopping', type: 'expense' },
  { id: 54, date: '2026-03-24', description: 'Gaming Purchase', amount: 60, category: 'Entertainment', type: 'expense' },
  { id: 55, date: '2026-03-26', description: 'Fresh Market', amount: 64, category: 'Groceries', type: 'expense' },
  { id: 56, date: '2026-03-28', description: 'Phone Bill', amount: 65, category: 'Utilities', type: 'expense' },

  // April (partial)
  { id: 57, date: '2026-04-01', description: 'Water Bill', amount: 42, category: 'Utilities', type: 'expense' },
  { id: 58, date: '2026-04-02', description: 'Grocery Store', amount: 110, category: 'Groceries', type: 'expense' },
];

export { mockTransactions, categories, categoryColors, descriptions };
