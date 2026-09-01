import { formatCurrency, formatDate } from '../../utils/cashier.utils';

export function ReceiptPreview({ sale }) {
  if (!sale) return null;

  return (
    <div className="mx-auto max-w-sm rounded-lg border border-border bg-surface p-6 font-mono text-sm">
      <div className="mb-4 text-center">
        <h3 className="text-base font-bold text-content">Innosify POS</h3>
        <p className="text-xs text-content-muted">Retail Store</p>
      </div>
      <div className="mb-4 space-y-1 border-b border-dashed border-border pb-4 text-xs text-content-muted">
        <p>Receipt: {sale.id}</p>
        <p>Date: {formatDate(sale.date)}</p>
        <p>Customer: {sale.customerName}</p>
        <p>Cashier: {sale.cashier}</p>
      </div>
      <div className="mb-4 space-y-2">
        {sale.items.map((item, i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="flex-1">{item.name} x{item.quantity}</span>
            <span>{formatCurrency(item.total)}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1 border-t border-dashed border-border pt-4 text-xs">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(sale.subtotal)}</span></div>
        {sale.discount > 0 && <div className="flex justify-between"><span>Discount</span><span>-{formatCurrency(sale.discount)}</span></div>}
        <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(sale.tax)}</span></div>
        <div className="flex justify-between text-sm font-bold"><span>Total</span><span>{formatCurrency(sale.total)}</span></div>
        <div className="flex justify-between text-content-muted"><span>Payment</span><span className="capitalize">{sale.paymentMethod}</span></div>
      </div>
      <p className="mt-4 text-center text-xs text-content-muted">Thank you for shopping!</p>
    </div>
  );
}
