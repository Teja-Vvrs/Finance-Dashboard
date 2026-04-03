import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, ArrowRight, Sparkles, FlaskConical } from 'lucide-react';

export default function Onboarding() {
  const { submitUser, darkMode } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState('');

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Please enter your name';
    if (!email.trim()) e.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (validate()) submitUser(name, email);
  };

  const inputBase = (field) => `
    w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200
    ${errors[field] ? 'border-fin-red' : focused === field
      ? 'border-fin-teal/60 ring-2 ring-fin-teal/15'
      : darkMode ? 'border-dark-border' : 'border-light-border'}
    ${darkMode
      ? 'bg-dark-surface text-dark-text placeholder:text-dark-text-muted'
      : 'bg-light-bg text-light-text placeholder:text-light-text-muted'}
  `;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
      darkMode ? 'bg-dark-bg' : 'bg-light-bg'
    }`}>
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-fin-teal/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-fin-blue/5 blur-[100px]" />
      </div>

      <div className={`relative w-full max-w-md animate-slide-up`}>
        {/* Card */}
        <div className={`rounded-2xl border shadow-2xl overflow-hidden ${
          darkMode
            ? 'bg-dark-card border-dark-border shadow-black/60'
            : 'bg-light-card border-light-border shadow-black/10'
        }`}>
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-fin-teal via-fin-blue to-fin-purple" />

          <div className="px-8 py-8">
            {/* Logo + heading */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-fin-teal/90 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-fin-teal/25 mb-4">
                F
              </div>
              <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>
                Welcome aboard
              </h1>
              <p className={`text-sm mt-1.5 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                Tell us a bit about yourself to personalise your dashboard
              </p>
            </div>

            {/* Disclaimer banner */}
            <div className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 mb-6 ${
              darkMode
                ? 'bg-fin-amber/5 border-fin-amber/20'
                : 'bg-fin-amber/8 border-fin-amber/30'
            }`}>
              <FlaskConical size={14} className="text-fin-amber shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-fin-amber uppercase tracking-[1.5px] mb-0.5">
                  Demo Project
                </p>
                <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                  This is a frontend UI demo. All financial data shown is randomly generated and for display purposes only. No real transactions, accounts, or money are involved.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-[2px] mb-1.5 ${
                  darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                }`}>Full Name</label>
                <div className="relative">
                  <User size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    focused === 'name' ? 'text-fin-teal' : darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                  }`} />
                  <input
                    type="text"
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                    className={inputBase('name')}
                  />
                </div>
                {errors.name && <p className="text-fin-red text-[11px] mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-[2px] mb-1.5 ${
                  darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                }`}>Email Address</label>
                <div className="relative">
                  <Mail size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    focused === 'email' ? 'text-fin-teal' : darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'
                  }`} />
                  <input
                    type="email"
                    placeholder="e.g. alex@email.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    className={inputBase('email')}
                  />
                </div>
                {errors.email && <p className="text-fin-red text-[11px] mt-1">{errors.email}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-fin-teal text-dark-bg text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-fin-teal/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <Sparkles size={15} />
                Go to my Dashboard
                <ArrowRight size={15} />
              </button>
            </form>

            <p className={`text-center text-[10px] mt-5 ${darkMode ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
              Your name &amp; email are stored locally on your device only — never sent anywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
