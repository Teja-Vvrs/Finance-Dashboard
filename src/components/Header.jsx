import { useApp } from '../context/AppContext';
import { Sun, Moon, User, Shield } from 'lucide-react';

export default function Header() {
  const { darkMode, toggleDarkMode, role, switchRole, user } = useApp();

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

          {/* Divider */}
          <div className={`w-px h-6 ${darkMode ? 'bg-dark-border' : 'bg-light-border'}`} />

          {/* Profile */}
          <div className="flex items-center gap-2.5 group relative cursor-pointer">
            {/* Avatar */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fin-teal to-fin-blue flex items-center justify-center text-white text-[11px] font-bold shadow-md shadow-fin-teal/20 ring-2 ring-fin-teal/30">
                {user?.initials}
              </div>
              {/* Online dot */}
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-fin-green border-2 border-dark-bg" />
            </div>

            {/* Name + role — hidden on small screens */}
            <div className="hidden sm:block leading-tight">
              <p className={`text-[12px] font-semibold leading-tight ${
                darkMode ? 'text-dark-text' : 'text-light-text'
              }`}>
                {user?.name}
              </p>
              <p className={`text-[9px] uppercase tracking-[2px] font-medium ${
                role === 'admin' ? 'text-fin-orange' : (darkMode ? 'text-dark-text-muted' : 'text-light-text-muted')
              }`}>
                {role}
              </p>
            </div>

            {/* Hover dropdown */}
            <div className={`absolute right-0 top-full mt-3 w-52 rounded-xl border shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden ${
              darkMode
                ? 'bg-dark-card border-dark-border shadow-black/50'
                : 'bg-light-card border-light-border shadow-black/10'
            }`}>
              {/* Profile header inside dropdown */}
              <div className={`px-4 py-3.5 border-b ${darkMode ? 'border-dark-border' : 'border-light-border'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fin-teal to-fin-blue flex items-center justify-center text-white text-[13px] font-bold shrink-0">
                    {user?.initials}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[13px] font-bold truncate ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>
                      {user?.name}
                    </p>
                    <p className={`text-[10px] truncate ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className={`grid grid-cols-2 divide-x ${darkMode ? 'divide-dark-border' : 'divide-light-border'}`}>
                <div className="px-4 py-3 text-center">
                  <p className={`text-[11px] font-bold ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>
                    {role === 'admin' ? 'Admin' : 'Viewer'}
                  </p>
                  <p className={`text-[9px] uppercase tracking-[1.5px] mt-0.5 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                    Role
                  </p>
                </div>
                <div className="px-4 py-3 text-center">
                  <p className="text-[11px] font-bold text-fin-green">Active</p>
                  <p className={`text-[9px] uppercase tracking-[1.5px] mt-0.5 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                    Status
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
