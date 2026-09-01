import { useLocation } from 'react-router-dom';
import { appConfig } from '@app/config/app.config';

const routeTitles = {
  'new-sale': 'New Sale',
  'held-sales': 'Held Sales',
  sales: 'Sales',
  returns: 'Returns & Exchanges',
  customers: 'Customers',
  shift: 'Current Shift',
  'cash-movements': 'Cash Movements',
  help: 'Help',
  profile: 'Profile',
};

export function Header() {
  const location = useLocation();
  const segment = location.pathname.split('/').pop();
  const title = routeTitles[segment];

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border bg-surface-elevated px-shell">
      <span className="text-sm font-medium text-content">{title || appConfig.name}</span>
    </header>
  );
}
