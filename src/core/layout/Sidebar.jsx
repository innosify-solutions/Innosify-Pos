import { NavigationShell } from '@core/navigation';
import { getActiveModuleNavigation } from '@app/moduleRegistry';

export function Sidebar() {
  const navigation = getActiveModuleNavigation();

  return (
    <aside className="flex w-sidebar shrink-0 flex-col border-r border-border bg-surface-elevated">
      <div className="flex h-14 items-center border-b border-border px-shell">
        <span className="text-sm font-semibold text-content">Innosify</span>
      </div>
      <NavigationShell navigation={navigation} />
    </aside>
  );
}
