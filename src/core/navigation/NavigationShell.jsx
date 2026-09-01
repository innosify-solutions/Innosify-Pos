import { NavLink } from 'react-router-dom';
import { cn } from '@utils/cn';

function NavItems({ items }) {
  return items.map((item) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        cn(
          'block rounded-lg px-3 py-2.5 text-sm transition-colors',
          isActive
            ? 'bg-accent-muted font-medium text-accent'
            : 'text-content-muted hover:bg-surface-muted hover:text-content'
        )
      }
    >
      {item.label}
    </NavLink>
  ));
}

/**
 * Navigation rendering framework.
 * Supports primary items and optional footer items from the active business module.
 */
export function NavigationShell({ navigation }) {
  const { primary = [], footer = [] } = Array.isArray(navigation)
    ? { primary: navigation, footer: [] }
    : navigation || { primary: [], footer: [] };

  if (primary.length === 0 && footer.length === 0) {
    return (
      <nav className="flex flex-1 flex-col p-shell">
        <p className="text-xs text-content-muted">No navigation configured</p>
      </nav>
    );
  }

  return (
    <nav className="flex flex-1 flex-col p-shell">
      <div className="flex-1 space-y-1">
        <NavItems items={primary} />
      </div>
      {footer.length > 0 && (
        <div className="mt-auto space-y-1 border-t border-border pt-3">
          <NavItems items={footer} />
        </div>
      )}
    </nav>
  );
}
