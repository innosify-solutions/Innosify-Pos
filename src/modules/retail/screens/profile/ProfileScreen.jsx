import { RetailPage } from '../../layouts/RetailPage';
import { useCashier } from '../../store';
import { useTheme } from '@core/theme';
import { Button } from '@shared/ui/Button';

export function ProfileScreen() {
  const { shift } = useCashier();
  const { theme, toggleTheme } = useTheme();

  return (
    <RetailPage title="Profile">
      <div className="max-w-md">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-muted text-2xl font-bold text-accent">
            {shift.openedBy.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-content">{shift.openedBy}</h2>
            <p className="text-sm text-content-muted">Cashier</p>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-border p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-content">Theme</span>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-content">Shift Status</span>
            <span className="text-sm capitalize text-content-muted">{shift.status}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-content">Store</span>
            <span className="text-sm text-content-muted">Retail Store #001</span>
          </div>
        </div>
      </div>
    </RetailPage>
  );
}
