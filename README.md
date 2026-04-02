# Finance Dashboard

A professional, interactive finance dashboard built with **React** and **Tailwind CSS** to track, analyze, and optimize financial activity.

![Finance Dashboard](https://img.shields.io/badge/React-v19-blue) ![Tailwind](https://img.shields.io/badge/TailwindCSS-v4-06b6d4) ![Vite](https://img.shields.io/badge/Vite-v8-646cff)

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd finance-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open `http://localhost:5173` in your browser.

---

## ✨ Features

### Dashboard Overview
- **Summary Cards** — Total Balance, Income, and Expenses with percentage change vs last month
- **Balance Trend** — Interactive area chart showing cumulative balance over time (Recharts)
- **Spending Breakdown** — Donut chart with category-wise expense distribution

### Insights Section
- Top spending category identification
- Monthly expense & income comparison
- Recent activity tracker (last 7 days)

### Transactions
- **Full transaction table** with 58 transactions (Jan–Apr 2026)
- **Search** by description or category
- **Filter** by category and type (income/expense)
- **Sort** by date or amount (ascending/descending)
- **Pagination** (10 items per page)
- **Export** to CSV or JSON

### Role-Based UI (RBAC Simulation)
- **Viewer** — Read-only access to all data
- **Admin** — Can add, edit, and delete transactions
- Role switching via dropdown in the header

### State Management
- **React Context API** for centralized state
- Manages: transactions, filters, role, dark mode
- **localStorage persistence** — data survives page reloads

### UI/UX
- **Dark mode** as default with light mode toggle
- **Responsive design** works on mobile, tablet, and desktop
- **Smooth animations** (fade-in, slide-up, scale-in)
- **Empty state handling** for filtered results
- Custom scrollbar styling
- Inter font from Google Fonts

---

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Tailwind CSS v4 | Utility-first styling |
| Vite 8 | Build tool & dev server |
| Recharts | Data visualization (charts) |
| Lucide React | Icon library |
| Context API | State management |
| localStorage | Data persistence |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx                    # Navigation & role switcher
│   ├── Dashboard/
│   │   ├── SummaryCards.jsx          # Balance, Income, Expense cards
│   │   ├── BalanceTrend.jsx          # Area chart
│   │   └── SpendingBreakdown.jsx     # Donut chart
│   ├── Insights/
│   │   └── InsightCards.jsx          # Key observations
│   └── Transactions/
│       ├── TransactionTable.jsx      # Table with filters & pagination
│       └── TransactionModal.jsx      # Add/Edit form
├── context/
│   └── AppContext.jsx                # Global state management
├── data/
│   └── transactions.js              # Mock data & category config
├── App.jsx                           # Main layout
├── main.jsx                          # Entry point
└── index.css                         # Tailwind config & animations
```

---

## 🎨 Design Approach

- **Dark-first design** with a deep navy/charcoal palette and vibrant accent colors
- **Glassmorphism** header with backdrop blur
- **Card-based layout** with consistent rounded corners (2xl) and hover effects
- **Color-coded data** — green for income, red for expenses, category-specific colors for badges and charts
- **Micro-animations** for entry transitions and interactive feedback
- **Typography**: Inter font family with careful weight hierarchy

---

## 🔧 Design Decisions

1. **Single-page layout** — All sections on one scrollable page for quick overview without navigation complexity
2. **Context API over Redux** — Sufficient for this scale; simpler API, less boilerplate
3. **Tailwind CSS v4** — Latest version with native `@theme` support, no config file needed
4. **Static mock data** — 58 hand-crafted transactions for realistic demo without API dependency
5. **localStorage persistence** — User changes (add/edit/delete) persist across sessions

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| Mobile (<640px) | Single column, stacked cards |
| Tablet (640–1024px) | 2-column grid for cards |
| Desktop (>1024px) | Full 3-column summary, 2-column charts, 4-column insights |

---

## ⚡ Optional Enhancements Implemented

- ✅ Dark mode (default) with light mode toggle
- ✅ Data persistence via localStorage
- ✅ Smooth animations and transitions
- ✅ Export functionality (CSV and JSON)
- ✅ Empty state handling
- ✅ Responsive design

---

## 📄 License

MIT
