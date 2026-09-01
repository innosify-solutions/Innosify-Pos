import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Sidebar } from './Sidebar.jsx';

const FULL_BLEED_ROUTES = ['/new-sale'];

/**
 * Root application layout shell.
 * Provides the persistent frame around module-specific content.
 */
export function AppLayout() {
  const location = useLocation();
  const isFullBleed = FULL_BLEED_ROUTES.some((r) => location.pathname.endsWith(r));

  return (
    <div className="flex h-full min-h-screen bg-surface">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className={`flex-1 overflow-hidden ${isFullBleed ? '' : 'overflow-auto'}`}>
          <Outlet />
        </main>
      </div>
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
