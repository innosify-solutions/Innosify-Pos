import { formatCurrency } from '../../utils/cashier.utils';

export function CartSummary({ totals, billDiscount }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-content-muted">
        <span>Subtotal</span>
        <span>{formatCurrency(totals.subtotal)}</span>
      </div>
      {billDiscount > 0 && (
        <div className="flex justify-between text-success">
          <span>Bill Discount</span>
          <span>-{formatCurrency(billDiscount)}</span>
        </div>
      )}
      <div className="flex justify-between text-content-muted">
        <span>Tax (8%)</span>
        <span>{formatCurrency(totals.tax)}</span>
      </div>
      <div className="flex justify-between border-t border-border pt-2 text-lg font-bold text-content">
        <span>Total</span>
        <span>{formatCurrency(totals.total)}</span>
      </div>
      <p className="text-xs text-content-muted">{totals.itemCount} item(s)</p>
    </div>
  );
}
