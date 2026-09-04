const shortcuts = [
  { keys: 'F1', action: 'New Sale' },
  { keys: 'F2', action: 'Search Product' },
  { keys: 'F3', action: 'Select Customer' },
  { keys: 'F4', action: 'Checkout' },
  { keys: 'F5', action: 'Hold Sale' },
  { keys: 'Esc', action: 'Close Dialog' },
  { keys: 'Enter', action: 'Confirm / Add by Barcode' },
];

export function HelpScreen() {
  return (
    <div className="flex h-full flex-col p-4">
      <h1 className="mb-4 text-[20px] font-bold text-gray-900">Help</h1>
      <div className="max-w-lg">
        <h2 className="mb-4 text-base font-semibold text-content">Keyboard Shortcuts</h2>
        <div className="space-y-2">
          {shortcuts.map((s) => (
            <div key={s.keys} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <span className="text-sm text-content">{s.action}</span>
              <kbd className="rounded bg-surface-muted px-2 py-1 font-mono text-xs text-content-muted">{s.keys}</kbd>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-lg bg-surface-muted p-4">
          <h3 className="mb-2 text-sm font-semibold text-content">Support</h3>
          <p className="text-sm text-content-muted">For technical support, contact your store administrator or Innosify support at support@innosify.com</p>
        </div>
      </div>
    </div>
  );
}
