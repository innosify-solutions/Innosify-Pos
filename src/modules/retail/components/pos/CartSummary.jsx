import { formatCurrency } from '../../utils/cashier.utils';

export function CartSummary({ totals, billDiscount }) {
  return (
    <div className="space-y-2 text-[13px]">
      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-semibold text-gray-900">{formatCurrency(totals.subtotal)}</span>
      </div>
      {billDiscount > 0 && (
        <div className="flex justify-between text-green-700">
          <span>Bill Discount</span>
          <span>-{formatCurrency(billDiscount)}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-gray-600">Tax (18%)</span>
        <span className="font-semibold text-gray-900">{formatCurrency(totals.tax)}</span>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
        <span className="text-[16px] font-bold text-gray-900">Total</span>
        <span className="text-[22px] font-bold text-gray-900">{formatCurrency(totals.total)}</span>
      </div>
    </div>
  );
}
