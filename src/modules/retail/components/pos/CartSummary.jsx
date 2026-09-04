import { formatCurrency } from '../../utils/cashier.utils';

export function CartSummary({ totals, billDiscount }) {
  return (
    <div className="space-y-1.5 text-[13px]">
      <div className="flex justify-between">
        <span className="font-medium text-gray-800">Subtotal</span>
        <span className="font-medium text-gray-900">{formatCurrency(totals.subtotal)}</span>
      </div>
      {billDiscount > 0 && (
        <div className="flex justify-between text-green-700">
          <span>Bill Discount</span>
          <span>-{formatCurrency(billDiscount)}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="font-medium text-gray-800">Tax (8%)</span>
        <span className="font-medium text-gray-900">{formatCurrency(totals.tax)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2.5">
        <span className="text-[16px] font-bold text-gray-900">Total</span>
        <span className="text-[20px] font-bold text-blue-600">{formatCurrency(totals.total)}</span>
      </div>
    </div>
  );
}
