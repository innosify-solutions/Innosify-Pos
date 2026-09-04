import { useState } from 'react';
import { cn } from '@utils/cn';
import { formatCurrency } from '../../utils/cashier.utils';

export function ProductCard({ product, onSelect }) {
  const outOfStock = product.stock <= 0;
  const [imgError, setImgError] = useState(false);
  const showImage = product.image && !imgError;

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      disabled={outOfStock}
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left transition-all',
        'hover:border-emerald-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
        outOfStock && 'pointer-events-none opacity-50'
      )}
    >
      <div
        className="relative flex h-[130px] items-center justify-center overflow-hidden"
        style={{ background: product.swatch || '#f3f4f6' }}
      >
        {showImage ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <span aria-hidden className="text-[52px] drop-shadow-md">
              🥻
            </span>
            {/* gold zari border strip */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[10px]"
              style={{ background: 'linear-gradient(90deg,#b45309,#fde68a 30%,#fbbf24 50%,#fde68a 70%,#b45309)' }}
            />
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col px-3 pb-2.5 pt-2">
        <p className="truncate text-[13px] font-semibold leading-tight text-gray-900">{product.name}</p>
        <p className="truncate text-[11px] text-gray-500">
          {product.fabric || `SKU: ${product.sku}`}
        </p>
        <p className="text-[11px] text-gray-400">SKU: {product.sku}</p>
        <p className="mt-1 text-[14px] font-bold text-gray-900">{formatCurrency(product.price)}</p>
        <p className="mt-1 flex items-center gap-1 text-[11px]">
          {product.stock <= 10 ? (
            <>
              <span className="flex h-2 w-2 items-center justify-center rounded-full bg-amber-500" />
              <span className="font-medium text-amber-600">Low Stock ({product.stock})</span>
            </>
          ) : (
            <>
              <span className="flex h-2 w-2 items-center justify-center rounded-full bg-green-500" />
              <span className="font-medium text-green-600">In stock ({product.stock})</span>
            </>
          )}
        </p>
      </div>
    </button>
  );
}
