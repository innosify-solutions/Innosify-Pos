import { forwardRef } from 'react';
import { cn } from '@utils/cn';

export const Input = forwardRef(function Input(
  { className, label, error, hint, id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-content">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'flex h-10 w-full rounded border border-border bg-surface px-3 text-sm text-content',
          'placeholder:text-content-muted',
          'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-danger focus:border-danger focus:ring-danger/20',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-content-muted">{hint}</p>}
    </div>
  );
});
