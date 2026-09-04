import { cn } from '@utils/cn';
import { formatCurrency } from '../../utils/cashier.utils';

const CATEGORY_EMOJI = {
  clothing: '👕',
  sarees: '🥻',
  ethnic: '👘',
  western: '👚',
  accessories: '👜',
};

const CATEGORY_TINT = {
  clothing: 'bg-sky-50',
  sarees: 'bg-rose-50',
  ethnic: 'bg-red-50',
  western: 'bg-amber-50',
  accessories: 'bg-slate-100',
};

export function ProductCard({ product, onSelect }) {
  const outOfStock = product.stock <= 0;
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      disabled={outOfStock}
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-[#e8dfc8] bg-white text-left transition-all',
        'hover:border-blue-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        outOfStock && 'pointer-events-none opacity-50'
      )}
    >
      <div className={cn('flex h-[104px] items-center justify-center text-[52px]', CATEGORY_TINT[product.category] || 'bg-gray-50')}>
        <span aria-hidden>{CATEGORY_EMOJI[product.category] || '👕'}</span>
      </div>
      <div className="flex flex-1 flex-col px-2.5 pb-2 pt-1.5">
        <p className="truncate text-[13px] font-semibold leading-tight text-gray-900">{product.name}</p>
        <p className="text-[11px] text-gray-500">SKU: {product.sku}</p>
        <p className="mt-0.5 text-[14px] font-bold text-gray-900">{formatCurrency(product.price)}</p>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-600">
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-600 text-[9px] font-bold text-white">✓</span>
          In stock ({product.stock})
        </p>
      </div>
    </button>
  );
}
