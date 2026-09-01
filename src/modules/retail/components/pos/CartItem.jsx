import { Button } from '@shared/ui/Button';
import { formatCurrency } from '../../utils/cashier.utils';

export function CartItem({ item, onQuantityChange, onRemove, onEdit }) {
  const price = item.priceOverride ?? item.price;
  const lineTotal = price * item.quantity - (item.discount || 0);

  return (
    <div className="flex gap-3 border-b border-border py-3 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-content">{item.name}</p>
        <p className="text-xs text-content-muted">
          {formatCurrency(price)}
          {item.discount > 0 && <span className="ml-1 text-success">-{formatCurrency(item.discount)}</span>}
          {item.priceOverride != null && <span className="ml-1 text-warning">(override)</span>}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onQuantityChange(item.productId, Math.max(1, item.quantity - 1))}
          className="flex h-8 w-8 items-center justify-center rounded border border-border text-content hover:bg-surface-muted"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <button
          type="button"
          onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded border border-border text-content hover:bg-surface-muted"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-semibold text-content">{formatCurrency(lineTotal)}</span>
        <div className="flex gap-1">
          <button type="button" onClick={() => onEdit(item)} className="text-xs text-accent hover:underline">Edit</button>
          <button type="button" onClick={() => onRemove(item.productId)} className="text-xs text-danger hover:underline">Remove</button>
        </div>
      </div>
    </div>
  );
}
