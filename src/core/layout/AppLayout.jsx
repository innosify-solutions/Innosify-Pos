import { createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Sidebar } from './Sidebar.jsx';
import { appConfig } from '@app/config/app.config';

const SHORTCUTS = [
  { key: 'F1', label: 'Help' },
  { key: 'F2', label: 'Search' },
  { key: 'F3', label: 'Held Sales' },
  { key: 'F4', label: 'Checkout' },
  { key: 'F5', label: 'New Customer' },
  { key: 'F6', label: 'Returns' },
  { key: 'Ctrl+S', label: 'Save' },
  { key: 'F12', label: 'Clear Cart' },
];

const RightPanelContext = createContext(null);

export function useRightPanel() {
  return useContext(RightPanelContext);
}

/**
 * Root application layout shell.
 * Provides a fixed sidebar + header + content area for all pages.
 * Pages can inject a right panel via the RightPanelContext.
 */
export function AppLayout() {
  return (
    <RightPanelContext.Provider value={null}>
      <div className="flex h-screen flex-col bg-[#eef0f3]">
        {/* Full-width top header — matches reference */}
        <Header />
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden px-4 py-3">
            <main className="min-h-0 flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
        <footer className="flex h-9 shrink-0 items-center gap-5 overflow-x-auto border-t border-gray-200 bg-white px-4">
          {SHORTCUTS.map((s) => (
            <span key={s.key} className="flex shrink-0 items-center gap-1.5 text-[12px]">
              <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-gray-700">
                {s.key}
              </kbd>
              <span className="text-gray-600">{s.label}</span>
            </span>
          ))}
          <span className="ml-auto text-[12px] text-gray-500">v{appConfig.version}</span>
        </footer>
      </div>
    </RightPanelContext.Provider>
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
