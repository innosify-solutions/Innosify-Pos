import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@utils/cn';
import { useCashier } from '../store';
import { retailConfig } from '../config/retail.config.js';
import { CustomerSelectModal } from '../screens/new-sale/CustomerSelectModal';
import { AddCustomerModal } from '../screens/new-sale/AddCustomerModal';

const base = retailConfig.routePrefix;

/**
 * The one constant sidebar used on every screen (New Sale included).
 * Same items, same order, same solid-blue active style everywhere.
 */
export const POS_NAV = [
  { label: 'New Sale', path: `${base}/new-sale`, icon: 'newSale' },
  { label: 'Held Sales', path: `${base}/held-sales`, icon: 'held' },
  { label: 'Sales', path: `${base}/sales`, icon: 'sales', activeMatch: `${base}/sales` },
  { label: 'Returns & Exchanges', path: `${base}/returns`, icon: 'returns', activeMatch: `${base}/returns` },
  { label: 'Customers', path: `${base}/customers`, icon: 'customers' },
  { label: 'Current Shift', path: `${base}/shift`, icon: 'shift' },
  { label: 'Cash Movements', path: `${base}/cash-movements`, icon: 'cash' },
  { label: 'Help', path: `${base}/help`, icon: 'help' },
  { label: 'Profile', path: `${base}/profile`, icon: 'profile' },
];

export function OnePosLogo({ size = 'md' }) {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 36 36" className={size === 'sm' ? 'h-7 w-7' : 'h-8 w-8'}>
        <path d="M18 2 32 10v16L18 34 4 26V10L18 2z" fill="#2563eb" />
        <path d="M18 2 32 10 18 18 4 10 18 2z" fill="#60a5fa" />
        <path d="M18 18v16L4 26V10l14 8z" fill="#1d4ed8" />
        <path d="M18 18v16l14-8V10l-14 8z" fill="#3b82f6" />
      </svg>
      <span className={size === 'sm' ? 'text-[18px] font-bold tracking-tight text-gray-900' : 'text-[20px] font-bold tracking-tight text-gray-900'}>
        OnePos
      </span>
    </span>
  );
}

export const NAV_ICONS = {
  dashboard: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  sales: <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
  newSale: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
  held: <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />,
  orders: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
  products: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
  customers: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
  purchase: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9h4m-4 4h4" />,
  reports: <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  expenses: <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5h2" />,
  staff: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  inventory: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  shift: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  cash: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  returns: <path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a3 3 0 00-3-3H6a3 3 0 00-3 3v1m18 0a2 2 0 01-2 2H5a2 2 0 01-2-2m18 0v-1a2 2 0 00-2-2M5 15v-1a2 2 0 012-2m12-5l3 3m0 0l-3 3m3-3H9" />,
  settings: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
  help: <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  profile: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  logout: <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
};

function itemClass(isActive, variant) {
  if (isActive && variant === 'soft') {
    return cn(
      'relative flex items-center gap-3 rounded-r-lg px-4 py-2.5 text-[13.5px] font-semibold text-blue-700',
      'bg-blue-50'
    );
  }
  return cn(
    'flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition-colors',
    isActive ? 'bg-blue-600 font-semibold text-white' : 'text-gray-700 hover:bg-gray-100'
  );
}

function ShellNav({ items, activeVariant = 'solid' }) {
  const location = useLocation();
  return (
    <nav className="flex-1 space-y-0.5">
      {items.map((item) => {
        const active = item.path ? (location.pathname === item.path || (item.activeMatch && location.pathname.startsWith(item.activeMatch))) : false;
        const icon = (
          <svg className={cn('h-5 w-5 shrink-0', active && activeVariant === 'soft' ? 'text-blue-600' : '')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            {NAV_ICONS[item.icon] || NAV_ICONS.dashboard}
          </svg>
        );
        if (!item.path) {
          return (
            <span key={item.label} className={cn(itemClass(false, activeVariant), 'cursor-default opacity-90')}>
              {icon}
              <span className="flex-1 truncate">{item.label}</span>
              {item.chevron && (
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </span>
          );
        }
        return (
          <NavLink key={item.label} to={item.path} className={itemClass(active, activeVariant)}>
            {active && activeVariant === 'soft' && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-blue-600" />}
            {icon}
            <span className="flex-1 truncate">{item.label}</span>
            {item.chevron && (
              <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

function ShellFooter({ variant }) {
  const navigate = useNavigate();
  if (variant === 'logout') {
    return (
      <button
        type="button"
        onClick={() => navigate(`${base}/profile`)}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] text-gray-700 hover:bg-gray-100"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
          {NAV_ICONS.logout}
        </svg>
        Logout
      </button>
    );
  }
  if (variant === 'store') {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0 2 2 0 00-4 0z" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-gray-900">OnePos Store</span>
          <span className="block text-[11.5px] text-gray-500">Main Outlet</span>
        </span>
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    );
  }
  if (variant === 'cashier') {
    return (
      <div className="flex items-center gap-2.5 rounded-lg px-1 py-1">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-300 text-[13px] font-bold text-gray-700">
          WC
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-gray-900">Walk-in Cashier</span>
          <span className="block text-[11.5px] text-gray-500">Cashier</span>
        </span>
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    );
  }
  if (variant === 'help') {
    return (
      <div className="flex items-start gap-2 px-2 py-1 text-[12.5px]">
        <svg className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
          {NAV_ICONS.help}
        </svg>
        <span>
          <span className="block text-gray-600">Need Help?</span>
          <button type="button" className="font-medium text-blue-600 hover:underline">Contact Support</button>
        </span>
      </div>
    );
  }
  if (variant === 'secure') {
    return (
      <div className="flex items-center gap-2 px-2 py-1 text-[11.5px] text-gray-500">
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Secure • Reliable • Easy to Use
      </div>
    );
  }
  if (variant === 'terminal') {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0 2 2 0 00-4 0z" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-gray-900">Main Store</span>
          <span className="block text-[11.5px] text-gray-500">Terminal 01</span>
        </span>
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    );
  }
  return null;
}

export function CustomerPill({ showAvatar = false, avatarText = 'A' }) {
  const { selectedCustomer } = useCashier();
  const [customerModal, setCustomerModal] = useState(false);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setCustomerModal(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-800 hover:border-gray-400"
      >
        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="max-w-[160px] truncate">{selectedCustomer?.name || 'Walk-in Customer'}</span>
        <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {showAvatar && (
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-[15px] font-bold text-white">
          {avatarText}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
        </span>
      )}
      <CustomerSelectModal
        open={customerModal}
        onClose={() => setCustomerModal(false)}
        onAddNew={() => { setCustomerModal(false); setAddCustomerModal(true); }}
      />
      <AddCustomerModal open={addCustomerModal} onClose={() => setAddCustomerModal(false)} />
    </>
  );
}

export function ShortcutBar({ items, label = null }) {
  return (
    <footer className="flex h-9 shrink-0 items-center gap-5 overflow-x-auto border-t border-gray-200 bg-white px-4">
      {label && (
        <>
          <span className="flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-blue-700">
            {label}
          </span>
          <span className="h-4 w-px shrink-0 bg-gray-300" />
        </>
      )}
      {items.map((s) => (
        <span key={s.key} className="flex shrink-0 items-center gap-1.5 text-[12px]">
          <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-gray-700">
            {s.key}
          </kbd>
          <span className="text-gray-600">{s.label}</span>
        </span>
      ))}
    </footer>
  );
}

export function ShellCard({ title, icon, action, children, className }) {
  return (
    <section className={cn('rounded-xl border border-gray-200 bg-white p-4', className)}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between">
          {title && (
            <h2 className="flex items-center gap-2 text-[15px] font-bold text-gray-900">
              {icon && <span className="text-blue-600">{icon}</span>}
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * Shared chrome for management screens (Held Sales, Sales, Returns, ...).
 * Matches the OnePos mock layouts: top bar + left nav + content + shortcut bar.
 */
export function PosPageShell({ title, topRight, navItems, activeVariant = 'solid', footer = 'logout', shortcuts = null, shortcutLabel = null, children }) {
  return (
    <div className="flex h-full flex-col bg-[#f4f6f9]">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4">
        <OnePosLogo />
        {title && (
          <>
            <span className="h-6 w-px bg-gray-300" />
            <div className="min-w-0">{title}</div>
          </>
        )}
        <div className="ml-auto flex items-center gap-2.5">{topRight}</div>
      </header>
      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[188px] shrink-0 flex-col gap-2 border-r border-gray-200 bg-white px-2 py-2">
          <ShellNav items={navItems} activeVariant={activeVariant} />
          <ShellFooter variant={footer} />
        </aside>
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4">{children}</main>
      </div>
      {shortcuts && <ShortcutBar items={shortcuts} label={shortcutLabel} />}
    </div>
  );
}

export { base as retailBase };
