import { useState } from 'react';
import { formatCurrency } from '../../utils/cashier.utils';

export function CartItem({ item, onQuantityChange, onRemove }) {
  const price = item.priceOverride ?? item.price;
  const lineTotal = price * item.quantity - (item.discount || 0);
  const [imgError, setImgError] = useState(false);
  const showImage = item.image && !imgError;

  const dec = () => {
    if (item.quantity > 1) onQuantityChange(item.productId, item.quantity - 1);
  };
  const inc = () => onQuantityChange(item.productId, item.quantity + 1);

  return (
    <div className="flex items-center justify-between gap-2.5 border-b border-gray-200 py-2 last:border-0">
      {/* Col 1 — image */}
      <span
        className="relative flex h-12 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 text-[22px]"
        style={{ background: item.swatch || '#ffffff' }}
      >
        {showImage ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden>🥻</span>
        )}
      </span>

      {/* Col 2 — title / count stepper */}
      <div className="min-w-0 max-w-[120px] flex-1">
        <p className="truncate text-[13px] font-semibold leading-tight text-gray-900">{item.name}</p>
        <span className="mt-1 inline-flex items-center gap-1">
          <button
            type="button"
            onClick={dec}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-6 w-6 items-center justify-center text-[15px] font-bold leading-none text-gray-700 hover:text-gray-900 disabled:opacity-40"
          >
            −
          </button>
          <span className="min-w-[26px] rounded-md border border-gray-300 px-1 py-0.5 text-center text-[12.5px] font-bold text-gray-900">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={inc}
            aria-label="Increase quantity"
            className="flex h-6 w-6 items-center justify-center text-[15px] font-bold leading-none text-gray-700 hover:text-gray-900"
          >
            +
          </button>
        </span>
      </div>

      {/* Col 3 — price / each price */}
      <div className="flex shrink-0 flex-col items-end">
        <p className="text-[15px] font-bold leading-tight text-gray-900">
          {formatCurrency(lineTotal)}
        </p>
        <span className="mt-0.5 text-[10.5px] leading-tight text-gray-500">
          {formatCurrency(price)} each
        </span>
      </div>

      {/* Col 4 — delete, centered on y-axis */}
      <button
        type="button"
        onClick={() => onRemove(item.productId)}
        aria-label={`Remove ${item.name}`}
        title="Remove item"
        className="flex h-7 w-7 shrink-0 self-center items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
