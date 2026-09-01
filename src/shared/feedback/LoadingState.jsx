import { cn } from '@utils/cn';

export function LoadingState({ message = 'Loading...', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16', className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
      <p className="mt-4 text-sm text-content-muted">{message}</p>
    </div>
  );
}
