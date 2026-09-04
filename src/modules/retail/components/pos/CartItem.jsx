import { formatCurrency } from '../../utils/cashier.utils';

export function CartItem({ item, onQuantityChange, onRemove, onEdit }) {
  const price = item.priceOverride ?? item.price;
  const lineTotal = price * item.quantity - (item.discount || 0);

  return (
    <div className="flex items-center gap-2 border-b border-gray-100 py-2.5 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-gray-900">{item.name}</p>
        <p className="text-[11px] text-gray-500">{formatCurrency(price)} each</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onQuantityChange(item.productId, Math.max(1, item.quantity - 1))}
          className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-100"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-6 text-center text-[13px] font-semibold">{item.quantity}</span>
        <button
          type="button"
          onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
          className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-100"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <div className="flex w-[72px] flex-col items-end">
        <span className="text-[13px] font-bold text-gray-900">{formatCurrency(lineTotal)}</span>
        <div className="flex gap-1.5">
          <button type="button" onClick={() => onEdit(item)} className="text-[11px] text-blue-600 hover:underline">Edit</button>
          <button type="button" onClick={() => onRemove(item.productId)} className="text-[11px] text-red-500 hover:underline">✕</button>
        </div>
      </div>
    </div>
  );
}
