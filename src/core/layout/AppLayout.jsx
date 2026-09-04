import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Sidebar } from './Sidebar.jsx';

const FULL_BLEED_ROUTES = ['/new-sale'];
// Management screens render their own chrome via PosPageShell.
const MANAGED_PAGE_RE = /\/retail\/(checkout|payment-complete|held-sales|sales|returns|cash-movements|shift)(\/|$)/;

const SHORTCUTS = [
  { key: 'F1', label: 'Help' },
  { key: 'F2', label: 'Search' },
  { key: 'F3', label: 'Hold Sale' },
  { key: 'F4', label: 'Checkout' },
  { key: 'F5', label: 'New Customer' },
  { key: 'F6', label: 'Returns' },
  { key: 'Ctrl+S', label: 'Save' },
  { key: 'Esc', label: 'Clear Cart' },
];

/**
 * Root application layout shell.
 * Provides the persistent frame around module-specific content.
 */
export function AppLayout() {
  const location = useLocation();
  const isFullBleed = FULL_BLEED_ROUTES.some((r) => location.pathname.endsWith(r));
  const isManaged = MANAGED_PAGE_RE.test(location.pathname);

  // NOTE: <Outlet /> stays at a stable tree position on every route.
  // Conditional siblings (Sidebar/Header/footer) may mount/unmount, but the
  // Outlet itself must never remount — otherwise RetailLayout and the cart
  // provider unmount and all cart state is lost on navigation.
  return (
    <div className={`flex h-screen flex-col ${isManaged ? 'bg-[#f4f6f9]' : 'bg-[#f7f8fa]'}`}>
      <div className="flex min-h-0 flex-1">
        {!isManaged && <Sidebar />}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {!isManaged && !isFullBleed && <Header />}
          <main className={`min-h-0 flex-1 overflow-hidden ${isFullBleed || isManaged ? '' : 'overflow-auto'}`}>
            <Outlet />
          </main>
        </div>
      </div>
      {!isManaged && (
        <footer className="flex h-9 shrink-0 items-center gap-6 overflow-x-auto border-t border-gray-200 bg-white px-4">
          {SHORTCUTS.map((s) => (
            <span key={s.key} className="flex shrink-0 items-center gap-1.5 text-[12px]">
              <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-gray-700">
                {s.key}
              </kbd>
              <span className="text-gray-600">{s.label}</span>
            </span>
          ))}
        </footer>
      )}
    </div>
  );
}

/**
 * Reusable page/workspace container within the application shell.
 */
export function WorkspaceShell({ title, children }) {
  return (
    <section className="flex h-full flex-col">
      {title && (
        <header className="mb-4 border-b border-border pb-3">
          <h1 className="text-lg font-semibold text-content">{title}</h1>
        </header>
      )}
      <div className="flex-1">{children}</div>
    </section>
  );
}
