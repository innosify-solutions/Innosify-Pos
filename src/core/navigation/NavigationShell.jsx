import { NavLink } from 'react-router-dom';
import { cn } from '@utils/cn';

const ICONS = {
  sale: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  ),
  held: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  ),
  sales: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9h4m-4 4h4" />
  ),
  returns: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a3 3 0 00-3-3H6a3 3 0 00-3 3v1m18 0a2 2 0 01-2 2H5a2 2 0 01-2-2m18 0v-1a2 2 0 00-2-2M5 15v-1a2 2 0 012-2m12-5l3 3m0 0l-3 3m3-3H9" />
  ),
  customers: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  ),
  shift: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  cash: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  help: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  profile: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  ),
};

function NavItems({ items }) {
  return items.map((item) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition-colors',
          isActive
            ? 'bg-blue-600 font-semibold text-white'
            : 'text-gray-700 hover:bg-gray-100'
        )
      }
    >
      {({ isActive }) => (
        <>
          <svg
            className={cn('h-5 w-5 shrink-0', isActive ? 'text-white' : 'text-gray-800')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={isActive ? 2.2 : 1.7}
          >
            {ICONS[item.icon] || ICONS.sale}
          </svg>
          <span className="truncate">{item.label}</span>
        </>
      )}
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
      <nav className="flex flex-1 flex-col px-2 py-2">
        <p className="text-xs text-content-muted">No navigation configured</p>
      </nav>
    );
  }

  return (
    <nav className="flex flex-1 flex-col px-2 py-2">
      <div className="flex-1 space-y-0.5">
        <NavItems items={primary} />
      </div>
      {footer.length > 0 && (
        <div className="mt-auto space-y-0.5 border-t border-border pt-3">
          <NavItems items={footer} />
        </div>
      )}
    </nav>
  );
}
