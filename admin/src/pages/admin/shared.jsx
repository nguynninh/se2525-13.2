/* eslint-disable react-refresh/only-export-components */
import React from 'react';

export const Badge = ({ children, tone = 'default' }) => {
  const map = {
    success: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/40',
    warning: 'bg-amber-500/15 text-amber-200 border-amber-400/40',
    danger: 'bg-rose-500/15 text-rose-200 border-rose-400/40',
    default: 'bg-slate-500/10 text-slate-200 border-slate-400/30',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${map[tone] || map.default}`}>
      {children}
    </span>
  );
};

export const EmptyState = ({ text }) => (
  <div className="border border-dashed border-slate-800 rounded-lg p-3 text-sm text-slate-400 text-center bg-slate-900/50">
    {text}
  </div>
);

export const StatCard = (props) => {
  const Icon = props.icon;
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-slate-950/40">
      <div className={`w-12 h-12 rounded-xl grid place-items-center ${props.tone}`}>
        <Icon className="w-5 h-5 text-slate-950" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide">{props.label}</p>
        <p className="text-2xl font-bold text-white">{props.value}</p>
        {props.desc ? <p className="text-xs text-slate-400 mt-1">{props.desc}</p> : null}
      </div>
    </div>
  );
};

export const SectionHeader = ({ title, subtitle, action, onAction }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <p className="text-sm text-slate-400">{subtitle}</p>
      <p className="text-lg font-semibold text-white">{title}</p>
    </div>
    {action ? (
      <button
        onClick={onAction}
        className="text-sm font-semibold text-slate-100 border border-slate-800 px-3 py-2 rounded-lg hover:border-emerald-400/60"
      >
        {action}
      </button>
    ) : null}
  </div>
);

export const PanelShell = ({ children }) => (
  <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg shadow-slate-950/40">
    {children}
  </section>
);

export const safeArray = (payload) => {
  const d = payload?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(d?.rows)) return d.rows;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload)) return payload;
  return [];
};
export const formatDate = (val) => (val ? new Date(val).toLocaleString() : '--');
export const formatMoney = (val) => {
  if (val === null || val === undefined) return '--';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val) || 0);
};
