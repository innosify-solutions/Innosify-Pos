import { cva } from 'class-variance-authority';
import { cn } from '@utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-surface-muted text-content',
        accent: 'bg-accent-muted text-accent',
        success: 'bg-success-muted text-success',
        warning: 'bg-warning-muted text-warning',
        danger: 'bg-danger-muted text-danger',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export function Badge({ children, variant, className }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}

export { badgeVariants };
