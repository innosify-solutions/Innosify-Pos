import { NavigationShell } from '@core/navigation';
import { getActiveModuleNavigation } from '@app/moduleRegistry';

export function Sidebar() {
  const navigation = getActiveModuleNavigation();

  return (
    <aside className="flex w-[188px] shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-[64px] items-center gap-2.5 border-b border-gray-100 px-4">
        <span className="flex h-9 w-9 items-center justify-center">
          <svg viewBox="0 0 36 36" className="h-9 w-9">
            <path d="M18 2 32 10v16L18 34 4 26V10L18 2z" fill="#2563eb" />
            <path d="M18 2 32 10 18 18 4 10 18 2z" fill="#60a5fa" />
            <path d="M18 18v16L4 26V10l14 8z" fill="#1d4ed8" />
            <path d="M18 18v16l14-8V10l-14 8z" fill="#3b82f6" />
          </svg>
        </span>
        <span className="text-[22px] font-bold tracking-tight text-gray-900">OnePos</span>
      </div>
      <NavigationShell navigation={navigation} />
    </aside>
  );
}
