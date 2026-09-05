import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatCurrency } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { retailConfig } from '../../config/retail.config.js';
import { ReceiptModal } from '../new-sale/SaleCompleteModal';

const base = retailConfig.routePrefix;

const STATUS_STYLES = {
  completed: 'bg-green-50 text-green-700',
  paid: 'bg-green-50 text-green-700',
  voided: 'bg-red-50 text-red-600',
  returned: 'bg-amber-50 text-amber-700',
  partial_return: 'bg-amber-50 text-amber-700',
};

const STATUS_LABELS = {
  completed: 'Completed',
  paid: 'Paid',
  voided: 'Voided',
  returned: 'Returned',
  partial_return: 'Partial Return',
};

const METHOD_LABELS = {
  cash: 'Cash',
  card: 'Credit Card',
  upi: 'UPI',
  wallet: 'Wallet',
  split: 'Split Payment',
};

function formatLong(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
}

const CATEGORY_EMOJI = { silk: '🥻', cotton: '🥻', banarasi: '🥻', kanjivaram: '🥻', chiffon: '🥻', georgette: '🥻', linen: '🥻', sarees: '🥻' };

export function OrderDetailsScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const saleId = decodeURIComponent(id || '');
  const { sales, customers, products } = useCashier();
  const [receiptOpen, setReceiptOpen] = useState(false);

  const sale = sales.find((s) => s.id === saleId);
  const customer = customers.find((c) => c.id === sale?.customerId);

  if (!sale) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#f4f6f9]">
        <p className="text-lg font-semibold text-gray-900">Order not found</p>
        <button
          type="button"
          onClick={() => navigate(`${base}/sales`)}
          className="mt-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to Sales
        </button>
      </div>
    );
  }

  const productById = Object.fromEntries(products.map((p) => [p.id, p]));
  const dateLabel = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-bold text-gray-900">Order Details</h2>
          <p className="mt-0.5 flex items-center gap-2 text-[13.5px]">
            <span className="font-semibold text-blue-600">#{sale.id}</span>
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${STATUS_STYLES[sale.status] || 'bg-gray-100 text-gray-600'}`}>
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-current text-[9px] text-white" style={{ backgroundColor: 'currentColor' }}>
                <span className="text-white">✓</span>
              </span>
              {STATUS_LABELS[sale.status] || sale.status}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => window.print()}
            className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-[13px] font-semibold text-gray-800 hover:bg-gray-50">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print Receipt
          </button>
          <button type="button" onClick={() => setReceiptOpen(true)}
            className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-[13px] font-semibold text-gray-800 hover:bg-gray-50">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            Email/SMS
          </button>
          <button type="button" onClick={() => navigate(`${base}/sales`)}
            className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-[13px] font-semibold text-white hover:bg-blue-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Sales
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-gray-900">
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" /></svg>
            Customer Information
          </h3>
          <div className="flex gap-4">
            <dl className="flex-1 space-y-0 text-[13.5px]">
              <div className="flex gap-6 border-b border-gray-100 py-2.5">
                <dt className="w-16 shrink-0 text-[12px] font-medium uppercase tracking-wide text-gray-500">Name</dt>
                <dd className="font-medium text-gray-900">{customer?.name || sale.customerName}</dd>
              </div>
              <div className="flex gap-6 border-b border-gray-100 py-2.5">
                <dt className="w-16 shrink-0 text-[12px] font-medium uppercase tracking-wide text-gray-500">Phone</dt>
                <dd className="font-medium text-gray-900">{customer?.phone || 'Not provided'}</dd>
              </div>
              <div className="flex gap-6 py-2.5">
                <dt className="w-16 shrink-0 text-[12px] font-medium uppercase tracking-wide text-gray-500">Type</dt>
                <dd className="font-medium text-gray-900">{customer?.isDefault === false ? 'Registered Customer' : 'Walk-in Customer'}</dd>
              </div>
            </dl>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" /></svg>
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-gray-900">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="2" y="5" width="20" height="14" rx="2" /><path strokeLinecap="round" d="M2 10h20" /></svg>
            Payment & Order Info
          </h3>
          <dl className="space-y-0 text-[13.5px]">
            {[
              { k: 'Payment Method', v: METHOD_LABELS[sale.paymentMethod] || sale.paymentMethod, icon: <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="2" y="5" width="20" height="14" rx="2" /><path strokeLinecap="round" d="M2 10h20" /></svg> },
              { k: 'Date & Time', v: formatLong(sale.date), icon: <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
              { k: 'Cashier', v: sale.cashier || 'Walk-in Cashier', icon: <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
              { k: 'Terminal', v: 'Terminal 01 - Front Counter', icon: <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><rect x="2" y="4" width="20" height="13" rx="2" /><path strokeLinecap="round" d="M8 21h8m-4-4v4" /></svg> },
            ].map((row) => (
              <div key={row.k} className="flex items-center gap-4 py-2">
                <dt className="w-36 shrink-0 text-[12px] font-medium uppercase tracking-wide text-gray-500">{row.k}</dt>
                <dd className="flex min-w-0 flex-1 items-center gap-2 font-medium text-gray-900">
                  {row.icon}
                  <span className="truncate">{row.v}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_280px] items-start gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-[15px] font-bold text-gray-900">Order Summary</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600">
                  <th className="px-3 py-2 font-medium">Item</th>
                  <th className="px-3 py-2 font-medium">SKU</th>
                  <th className="px-3 py-2 text-right font-medium">Unit Price</th>
                  <th className="px-3 py-2 text-center font-medium">Qty</th>
                  <th className="px-3 py-2 text-right font-medium">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item, i) => {
                  const p = productById[item.productId];
                  return (
                    <tr key={`${item.productId}-${i}`} className="border-t border-gray-100">
                      <td className="px-3 py-2.5">
                        <span className="flex items-center gap-2 font-medium text-gray-900">
                          <span className="text-[20px]">{CATEGORY_EMOJI[p?.category] || '🥻'}</span>
                          {item.name}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">{p?.sku || '—'}</td>
                      <td className="px-3 py-2.5 text-right text-gray-800">{formatCurrency(item.price)}</td>
                      <td className="px-3 py-2.5 text-center text-gray-800">{item.quantity}</td>
                      <td className="px-3 py-2.5 text-right font-medium text-gray-900">{formatCurrency(item.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-[13.5px]">
            <dl className="space-y-2">
              <div className="flex justify-between"><dt className="text-gray-600">Subtotal</dt><dd className="font-medium">{formatCurrency(sale.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Tax (8%)</dt><dd className="font-medium">{formatCurrency(sale.tax)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Discount</dt><dd className="font-medium text-green-600">{formatCurrency(sale.discount || 0)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Tip</dt><dd className="font-medium">{formatCurrency(sale.tip || 0)}</dd></div>
            </dl>
            <div className="mt-2.5 flex items-center justify-between border-t border-gray-100 pt-2.5">
              <span className="text-[14px] font-bold">Grand Total</span>
              <span className="text-[19px] font-bold text-blue-600">{formatCurrency(sale.total)}</span>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h4 className="mb-2 flex items-center gap-1.5 text-[13.5px] font-bold text-blue-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" /></svg>
              Notes
            </h4>
            <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-[13px] text-gray-600">
              {sale.notes || 'No notes available.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <button type="button" onClick={() => window.print()}
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-[13.5px] font-semibold text-gray-800 hover:bg-gray-50">
          <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print Receipt
        </button>
        <button type="button" onClick={() => setReceiptOpen(true)}
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-[13.5px] font-semibold text-gray-800 hover:bg-gray-50">
          <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          Email / SMS Receipt
        </button>
        <button type="button" onClick={() => navigate(`${base}/sales`)}
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 text-[13.5px] font-semibold text-white hover:bg-blue-700">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Sales
        </button>
      </div>

      <ReceiptModal
        open={receiptOpen}
        sale={sale}
        onClose={() => setReceiptOpen(false)}
        onNewSale={() => navigate(`${base}/new-sale`)}
      />
    </div>
  );
}
