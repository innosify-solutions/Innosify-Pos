import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { retailConfig } from '../../config/retail.config.js';
import { PosPageShell, POS_NAV } from '../../components/PosPageShell.jsx';

const base = retailConfig.routePrefix;
const PAGE_SIZE = 6;

const STATUS_LABELS = {
  completed: 'Completed',
  paid: 'Paid',
  voided: 'Voided',
  returned: 'Returned',
  partial_return: 'Partial Return',
};

const METHOD_META = {
  cash: { label: 'Cash', cls: 'text-green-700', icon: <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[11px] font-bold text-white">$</span> },
  card: { label: 'Credit Card', cls: 'text-blue-700', icon: <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="2" y="5" width="20" height="14" rx="2" /><path strokeLinecap="round" d="M2 10h20" /></svg> },
  upi: { label: 'UPI', cls: 'text-blue-700', icon: <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg> },
  wallet: { label: 'Wallet', cls: 'text-purple-700', icon: <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2 2 0 00-2-2h-4a2 2 0 100 4h4a2 2 0 002-2zM3 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg> },
  split: { label: 'Split', cls: 'text-gray-700', icon: <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
};

function formatSaleDate(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
}

function StatCard({ icon, label, value, delta }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <span>{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-[12.5px] text-gray-600">{label}</p>
        <p className="text-[20px] font-bold leading-tight text-gray-900">{value}</p>
        <p className="text-[11.5px] font-medium text-green-600">↑ {delta} vs yesterday</p>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, icon }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-semibold text-gray-700">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white pl-3 pr-9 text-[13px] text-gray-800 focus:border-blue-500 focus:outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>
      </span>
    </label>
  );
}

export function SalesScreen() {
  const navigate = useNavigate();
  const { sales } = useCashier();
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('today');
  const [method, setMethod] = useState('all');
  const [cashier, setCashier] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const dataToday = useMemo(() => {
    const max = sales.reduce((m, s) => Math.max(m, new Date(s.date).getTime()), 0);
    const d = new Date(max);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [sales]);

  const dayStart = (iso) => {
    const d = new Date(iso);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return [...sales]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter((s) => {
        if (q && !(s.id.toLowerCase().includes(q) || (s.customerName || '').toLowerCase().includes(q) || String(s.total).includes(q))) return false;
        if (method !== 'all' && s.paymentMethod !== method) return false;
        if (cashier !== 'all' && s.cashier !== cashier) return false;
        if (status !== 'all' && s.status !== status) return false;
        if (dateRange !== 'all') {
          const diffDays = Math.round((dataToday.getTime() - dayStart(s.date)) / 86400000);
          if (dateRange === 'today' && diffDays !== 0) return false;
          if (dateRange === 'yesterday' && diffDays !== 1) return false;
          if (dateRange === 'week' && (diffDays < 0 || diffDays > 6)) return false;
        }
        return true;
      });
  }, [sales, search, method, cashier, status, dateRange, dataToday]);

  const validSales = sales.filter((s) => s.status !== 'voided');
  const totalRevenue = validSales.reduce((s, x) => s + x.total, 0);
  const totalItems = validSales.reduce((s, x) => s + x.items.reduce((a, i) => a + i.quantity, 0), 0);
  const uniqueCustomers = new Set(validSales.map((x) => x.customerId)).size;
  const avgOrder = validSales.length ? totalRevenue / validSales.length : 0;

  const cashiers = [...new Set(sales.map((s) => s.cashier).filter(Boolean))];
  const statuses = [...new Set(sales.map((s) => s.status))];

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetPage = (fn) => (v) => { setPage(1); fn(v); };

  return (
    <PosPageShell
      title={
        <span className="flex items-center gap-2 text-[16px] font-semibold">
          <span className="text-gray-900">OnePos</span>
          <span className="h-4 w-px bg-gray-300" />
          <span className="text-blue-600">Sales</span>
        </span>
      }
      topRight={
        <>
          <button type="button" aria-label="Notifications" className="relative rounded-lg p-1.5 hover:bg-gray-100">
            <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">3</span>
          </button>
          <span className="flex items-center gap-1.5 text-[13.5px] font-semibold text-gray-900">
            <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Admin
          </span>
          <span className="h-5 w-px bg-gray-300" />
          <button type="button" aria-label="Logout" className="rounded-lg p-1.5 hover:bg-gray-100">
            <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </>
      }
      navItems={POS_NAV}
      footer="store"
    >
      <div className="mb-3 flex items-center gap-2.5">
        <h2 className="text-[22px] font-bold text-gray-900">Sales</h2>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[12px] font-semibold text-blue-700">
          Today: {validSales.length} sales
        </span>
      </div>

      <div className="mb-3 grid grid-cols-4 gap-3">
        <StatCard
          label="Total Sales Today"
          value={formatCurrency(totalRevenue)}
          delta="18.6%"
          icon={<span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-[20px] font-bold text-blue-600">$</span>}
        />
        <StatCard
          label="Average Order Value"
          value={formatCurrency(avgOrder)}
          delta="12.4%"
          icon={<span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50"><svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg></span>}
        />
        <StatCard
          label="Total Items Sold"
          value={totalItems}
          delta="15.3%"
          icon={<span className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-50"><svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></span>}
        />
        <StatCard
          label="Unique Customers"
          value={uniqueCustomers}
          delta="20%"
          icon={<span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50"><svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></span>}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <div className="mb-2 grid grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))] items-end gap-2.5">
          <div>
            <div className="relative">
              <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by Order ID, Customer, or Amount"
                className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-[13px] focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <FilterSelect label="Date Range" value={dateRange} onChange={resetPage(setDateRange)}
            options={[{ value: 'today', label: 'Today' }, { value: 'yesterday', label: 'Yesterday' }, { value: 'week', label: 'Last 7 days' }, { value: 'all', label: 'All time' }]}
            icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
          <FilterSelect label="Payment Method" value={method} onChange={resetPage(setMethod)}
            options={[{ value: 'all', label: 'All' }, { value: 'cash', label: 'Cash' }, { value: 'card', label: 'Card' }, { value: 'upi', label: 'UPI' }, { value: 'wallet', label: 'Wallet' }, { value: 'split', label: 'Split' }]}
            icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="2" y="5" width="20" height="14" rx="2" /><path strokeLinecap="round" d="M2 10h20" /></svg>} />
          <FilterSelect label="Cashier" value={cashier} onChange={resetPage(setCashier)}
            options={[{ value: 'all', label: 'All' }, ...cashiers.map((c) => ({ value: c, label: c }))]}
            icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
          <FilterSelect label="Status" value={status} onChange={resetPage(setStatus)}
            options={[{ value: 'all', label: 'All' }, ...statuses.map((s) => ({ value: s, label: STATUS_LABELS[s] || s }))]}
            icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z" /></svg>} />
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 text-left text-[12px] text-gray-600">
                {['Order ID', 'Date & Time', 'Customer', 'Items', 'Total Amount', 'Payment Method', 'Status'].map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-2.5 font-semibold">
                    {h} <span className="text-gray-400">↕</span>
                  </th>
                ))}
                <th className="px-3 py-2.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((s) => {
                const meta = METHOD_META[s.paymentMethod] || METHOD_META.cash;
                const itemCount = s.items.reduce((a, i) => a + i.quantity, 0);
                const bad = s.status === 'voided';
                return (
                  <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                    <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-gray-900">#{s.id}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-gray-700">{formatSaleDate(s.date)}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-gray-800">{s.customerName}</td>
                    <td className="px-3 py-2.5 text-center text-gray-800">{itemCount}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-gray-900">{formatCurrency(s.total)}</td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <span className={`flex items-center gap-1.5 font-medium ${meta.cls}`}>{meta.icon}{meta.label}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${bad ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                        {STATUS_LABELS[s.status] || s.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => navigate(`${base}/sales/${encodeURIComponent(s.id)}`)}
                          className="flex h-8 items-center gap-1 rounded-md border border-gray-300 px-2.5 text-[12px] font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="flex h-8 items-center gap-1 rounded-md bg-blue-600 px-2.5 text-[12px] font-semibold text-white hover:bg-blue-700"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {pageRows.length === 0 && (
            <p className="border-t border-gray-100 py-10 text-center text-sm text-gray-500">No sales match your filters.</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3">
          <p className="text-[12.5px] text-gray-600">
            Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} to {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} sales
          </p>
          <div className="flex items-center gap-1.5">
            <button type="button" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} type="button" onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-lg text-[13px] font-semibold ${p === safePage ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                {p}
              </button>
            ))}
            <button type="button" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40">›</button>
          </div>
        </div>
      </div>
    </PosPageShell>
  );
}
