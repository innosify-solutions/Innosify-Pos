import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@utils/cn';
import { formatCurrency } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { retailConfig } from '../../config/retail.config.js';
import { CustomerSelectModal } from '../new-sale/CustomerSelectModal';
import { AddCustomerModal } from '../new-sale/AddCustomerModal';
import { ConfirmationDialog } from '@shared/dialogs/ConfirmationDialog';

export const LAST_SALE_KEY = 'onepos-last-sale-v1';

const base = retailConfig.routePrefix;

const PAY_OPTIONS = [
  {
    id: 'cash',
    label: 'Cash',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
        <path strokeLinecap="round" d="M6 12h.01M18 12h.01" strokeWidth={2.4} />
      </svg>
    ),
  },
  {
    id: 'card',
    label: 'Credit/Debit Card',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path strokeLinecap="round" d="M2 10h20" />
      </svg>
    ),
  },
  {
    id: 'upi',
    label: 'UPI',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m0 14v1m-7-9H4m16 0h-1M7 7H4v3h3V7zm0 7H4v3h3v-3zm10-7h3v3h-3V7zm0 7h3v3h-3v-3zM7 12h10" />
      </svg>
    ),
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2 2 0 00-2-2h-4a2 2 0 100 4h4a2 2 0 002-2zM3 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      </svg>
    ),
  },
  {
    id: 'split',
    label: 'Split Payment',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
];

const FOOT_SHORTCUTS = [
  { key: 'Ctrl + K', label: 'Search Items' },
  { key: 'F2', label: 'Edit Customer' },
  { key: 'F4', label: 'Hold Sale' },
  { key: 'F8', label: 'Complete Payment' },
  { key: 'Esc', label: 'Back to Cart' },
];

function Card({ title, icon, step, children, className }) {
  return (
    <section className={cn('rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.07)]', className)}>
      <h2 className="mb-4 flex items-center gap-2.5 text-[15px] font-bold text-gray-900">
        {step ? (
          <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0C4C2A] text-[12px] font-bold text-white">
            {step}
          </span>
        ) : (
          <span aria-hidden="true" className="text-emerald-700">{icon}</span>
        )}
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CheckoutScreen() {
  const navigate = useNavigate();
  const { cart, cartTotals, selectedCustomer, billDiscount, holdSale, completeSale, PAYMENT_METHODS } = useCashier();

  const [method, setMethod] = useState(PAYMENT_METHODS.CASH);
  const [notes, setNotes] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');
  const [upiAmount, setUpiAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [holdConfirm, setHoldConfirm] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const notesRef = useRef(null);

  const grandTotal = cartTotals.total;
  const isSplit = method === PAYMENT_METHODS.SPLIT;
  const splitTotal = (Number(cashAmount) || 0) + (Number(cardAmount) || 0) + (Number(upiAmount) || 0);
  const splitValid = Math.abs(splitTotal - grandTotal) < 0.01;

  const canComplete = useMemo(
    () => cart.length > 0 && !processing && (!isSplit || splitValid),
    [cart.length, processing, isSplit, splitValid]
  );

  const doHold = () => {
    holdSale();
    setHoldConfirm(false);
    navigate(`${base}/held-sales`);
  };

  const doComplete = () => {
    if (!canComplete) return;
    setProcessing(true);
    setTimeout(() => {
      const paymentDetails = isSplit
        ? {
            method: 'split',
            tip: 0,
            notes: notes.trim(),
            payments: [
              { method: PAYMENT_METHODS.CASH, amount: Number(cashAmount) || 0 },
              { method: PAYMENT_METHODS.CARD, amount: Number(cardAmount) || 0 },
              { method: PAYMENT_METHODS.UPI, amount: Number(upiAmount) || 0 },
            ].filter((p) => p.amount > 0),
          }
        : {
            method,
            tip: 0,
            notes: notes.trim(),
            cashReceived: 0,
            payments: [{ method, amount: grandTotal }],
          };
      const sale = completeSale(paymentDetails);
      try {
        localStorage.setItem(LAST_SALE_KEY, JSON.stringify(sale));
      } catch {
        // storage unavailable — success page falls back to in-memory sales
      }
      setProcessing(false);
      navigate(`${base}/payment-complete`, { state: { saleId: sale.id } });
    }, 500);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setCustomerModal(true);
      } else if (e.key === 'F4') {
        e.preventDefault();
        if (cart.length > 0) setHoldConfirm(true);
      } else if (e.key === 'F8') {
        e.preventDefault();
        doComplete();
      } else if (e.key === 'Escape') {
        navigate(`${base}/new-sale`);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        notesRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (cart.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-lg font-semibold text-gray-900">No items to check out</p>
        <p className="text-sm text-gray-500">Add products from New Sale first.</p>
        <button
          type="button"
          onClick={() => navigate(`${base}/new-sale`)}
          className="mt-2 rounded-xl bg-[#0C4C2A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0a3d22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          Back to New Sale
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Main content */}
      <main aria-label="Checkout" className="thin-scroll min-h-0 flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-5">
          <div className="min-w-0 space-y-4">
              <Card
                title="Order Summary"
                step="1"
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9h4m-4 4h4" />
                  </svg>
                }
              >
                <div className="mb-3 flex items-center gap-2.5 rounded-xl bg-gray-50 px-3 py-2">
                  <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <svg className="h-5 w-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-bold text-gray-900">{selectedCustomer?.name || 'Walk-in Customer'}</span>
                    <span className="block text-[12px] text-gray-500">Phone: {selectedCustomer?.phone || 'Not provided'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomerModal(true)}
                    className="shrink-0 rounded-lg border border-emerald-700 px-2.5 py-1.5 text-[12.5px] font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1"
                  >
                    Change
                  </button>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full text-[13px]">
                    <caption className="sr-only">Items in this order</caption>
                    <thead>
                      <tr className="bg-gray-50 text-left text-gray-600">
                        <th scope="col" className="px-3 py-2 font-medium">Item</th>
                        <th scope="col" className="px-3 py-2 text-right font-medium">Unit Price</th>
                        <th scope="col" className="px-3 py-2 text-center font-medium">Qty</th>
                        <th scope="col" className="px-3 py-2 text-right font-medium">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-900">
                      {cart.map((item) => {
                        const unit = item.priceOverride ?? item.price;
                        const line = unit * item.quantity - (item.discount || 0);
                        return (
                          <tr key={item.productId} className="border-t border-gray-100">
                            <td className="px-3 py-2">{item.name}</td>
                            <td className="px-3 py-2 text-right">{formatCurrency(unit)}</td>
                            <td className="px-3 py-2 text-center">{item.quantity}</td>
                            <td className="px-3 py-2 text-right font-medium">{formatCurrency(line)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card
                title="Payment Method"
                step="2"
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path strokeLinecap="round" d="M2 10h20" />
                  </svg>
                }
              >
                <div role="group" aria-label="Choose a payment method" className="grid grid-cols-5 gap-2">
                  {PAY_OPTIONS.map((opt) => {
                    const selected = method === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setMethod(opt.id)}
                        aria-pressed={selected}
                        className={cn(
                          'relative flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1',
                          selected
                            ? 'border-emerald-700 bg-emerald-50 text-gray-900 ring-1 ring-emerald-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        )}
                      >
                        {selected && (
                          <span aria-hidden="true" className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-[11px] font-bold text-white">
                            ✓
                          </span>
                        )}
                        <span aria-hidden="true" className={selected ? 'text-emerald-700' : 'text-gray-500'}>{opt.icon}</span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {isSplit && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-medium text-gray-600">Cash</span>
                      <input
                        type="number"
                        min="0"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        placeholder="0.00"
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-medium text-gray-600">Card</span>
                      <input
                        type="number"
                        min="0"
                        value={cardAmount}
                        onChange={(e) => setCardAmount(e.target.value)}
                        placeholder="0.00"
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-medium text-gray-600">UPI</span>
                      <input
                        type="number"
                        min="0"
                        value={upiAmount}
                        onChange={(e) => setUpiAmount(e.target.value)}
                        placeholder="0.00"
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                      />
                    </label>
                    <p aria-live="polite" className={cn('col-span-3 text-[12px] font-medium', splitValid ? 'text-emerald-700' : 'text-red-600')}>
                      Split total: {formatCurrency(splitTotal)} / {formatCurrency(grandTotal)}
                    </p>
                  </div>
                )}

                <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50/60 p-3">
                  <label htmlFor="checkout-notes" className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-800">
                    <svg aria-hidden="true" className="h-4 w-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                    </svg>
                    Notes
                  </label>
                  <textarea
                    id="checkout-notes"
                    ref={notesRef}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes for this sale (optional)"
                    rows={2}
                    className="mt-2 w-full resize-y rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="mt-1 text-[11.5px] text-gray-500">Visible in order details</p>
                </div>
              </Card>
            </div>

            <div className="min-w-0 space-y-4">
            <Card
              title="Pricing Summary"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <path strokeLinecap="round" d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01" strokeWidth={2} />
                </svg>
              }
            >
              <dl className="space-y-2.5 text-[13.5px]">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-semibold text-gray-900">{formatCurrency(cartTotals.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Tax (8%)</dt>
                  <dd className="font-semibold text-gray-900">{formatCurrency(cartTotals.tax)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Discount</dt>
                  <dd className="font-semibold text-emerald-700">−{formatCurrency(billDiscount)}</dd>
                </div>
                <div className="flex justify-between border-t border-dashed border-gray-200 pt-2.5">
                  <dt className="text-gray-600">{`Items (${cartTotals.itemCount})`}</dt>
                  <dd className="font-semibold text-gray-900">{selectedCustomer?.name || 'Walk-in Customer'}</dd>
                </div>
              </dl>
              <div aria-live="polite" className="mt-3 flex items-center justify-between rounded-xl bg-[#0C4C2A] px-4 py-3.5 shadow-[0_2px_8px_rgba(12,76,42,0.35)]">
                <span className="text-[15px] font-bold uppercase tracking-wide text-emerald-100">Total</span>
                <span className="text-[24px] font-bold text-white">{formatCurrency(grandTotal)}</span>
              </div>
            </Card>

            <Card
              title="Actions"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            >
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={doComplete}
                  disabled={!canComplete}
                  aria-busy={processing}
                  className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-[15px] font-bold text-white shadow-[0_2px_8px_rgba(22,163,74,0.4)] hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
                >
                  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {processing ? 'Processing…' : 'Complete Payment'}
                </button>
                <button
                  type="button"
                  onClick={() => setHoldConfirm(true)}
                  disabled={cart.length === 0}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 text-[14px] font-bold text-white shadow-[0_2px_8px_rgba(245,158,11,0.35)] hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                >
                  Hold Sale
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`${base}/new-sale`)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-200 text-[14px] font-bold text-gray-800 hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
                >
                  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Cart
                </button>
              </div>
            </Card>
            </div>
          </div>
        </main>

      <CustomerSelectModal
        open={customerModal}
        onClose={() => setCustomerModal(false)}
        onAddNew={() => { setCustomerModal(false); setAddCustomerModal(true); }}
      />
      <AddCustomerModal open={addCustomerModal} onClose={() => setAddCustomerModal(false)} />
      <ConfirmationDialog
        open={holdConfirm}
        onClose={() => setHoldConfirm(false)}
        onConfirm={doHold}
        title="Hold Sale"
        message="This sale will be saved and can be resumed later from Held Sales."
        confirmLabel="Hold Sale"
      />
    </div>
  );
}
