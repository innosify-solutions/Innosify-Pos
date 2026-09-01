import { WorkspaceShell } from '@core/layout';

export function RetailPage({ title, children, className = '' }) {
  return (
    <div className={`flex h-full flex-col p-shell ${className}`}>
      <WorkspaceShell title={title}>{children}</WorkspaceShell>
    </div>
  );
}
