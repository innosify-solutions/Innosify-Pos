import { cn } from '@utils/cn';
import { formatCurrency } from '../../utils/cashier.utils';

export function ProductCard({ product, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className={cn(
        'flex flex-col rounded-lg border border-border bg-surface p-3 text-left transition-all',
        'hover:border-accent hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        product.stock <= 0 && 'pointer-events-none opacity-50'
      )}
    >
      <div className="mb-2 flex h-16 items-center justify-center rounded-md bg-surface-muted text-2xl">
        {product.name.charAt(0)}
      </div>
      <p className="line-clamp-2 text-sm font-medium text-content">{product.name}</p>
      <p className="mt-1 text-xs text-content-muted">{product.sku}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-accent">{formatCurrency(product.price)}</span>
        <span className="text-xs text-content-muted">Stock: {product.stock}</span>
      </div>
    </button>
  );
}
