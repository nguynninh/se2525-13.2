import React from 'react';
import { Search, LogOut, ShieldCheck, Sparkles } from 'lucide-react';

const Header = ({ user, onLogout, onNavigate }) => {
  return (
    <div className="sticky top-0 z-10 bg-slate-950/70 backdrop-blur border-b border-slate-800 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/60 to-sky-500/60 border border-slate-800 grid place-items-center text-slate-950 font-extrabold">
          AD
        </div>
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Admin role
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Tiki Mobile Admin</h1>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> {user?.email || 'admin'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Quick search user / shop / order"
            className="pl-10 pr-3 py-2 rounded-xl bg-slate-900/70 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            onFocus={() => onNavigate?.('overview')}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/80 text-sm font-semibold text-slate-100 hover:border-emerald-400/60 hover:text-white"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </div>
  );
};

export default Header;
