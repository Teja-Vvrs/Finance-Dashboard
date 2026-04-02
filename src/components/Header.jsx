import { useApp } from '../context/AppContext';
import { Sun, Moon, User, Shield } from 'lucide-react';

export default function Header() {
  const { darkMode, toggleDarkMode, role, switchRole } = useApp();

  return (
    <header className={`sticky top-0 z-50 ${
      darkMode
        ? 'bg-dark-bg/95 backdrop-blur-md'
        : 'bg-light-bg/95 backdrop-blur-md'
    }`}>
      {/* Accent gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-fin-teal/40 to-transparent" />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-fin-teal/90 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-fin-teal/20">
            F
          </div>
          <div>
            <h1 className={`text-[15px] font-bold tracking-tight leading-tight ${
              darkMode ? 'text-dark-text' : 'text-light-text'
            }`}>
              Finance Dashboard
            </h1>
            <p className={`text-[9px] uppercase tracking-[3px] font-medium ${
              darkMode ? 'text-fin-teal/70' : 'text-fin-teal'
            }`}>
              Track • Analyze • Optimize
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2.5">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              darkMode
                ? 'text-dark-text-muted hover:text-fin-amber hover:bg-dark-card'
                : 'text-light-text-muted hover:text-fin-amber hover:bg-light-card'
            }`}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Role Switcher */}
          <div className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border transition-all ${
            darkMode
              ? 'border-dark-border bg-dark-card'
              : 'border-light-border bg-light-card'
          }`}>
            {role === 'admin' ? (
              <Shield size={14} className="text-fin-orange" />
            ) : (
              <User size={14} className={darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'} />
            )}
            <select
              value={role}
              onChange={(e) => switchRole(e.target.value)}
              className={`bg-transparent text-xs font-semibold outline-none cursor-pointer uppercase tracking-widest ${
                darkMode ? 'text-dark-text' : 'text-light-text'
              }`}
            >
              <option value="viewer" className="bg-dark-card text-dark-text">Viewer</option>
              <option value="admin" className="bg-dark-card text-dark-text">Admin</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
