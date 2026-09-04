import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@utils/cn';
import { formatCurrency } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { retailConfig } from '../../config/retail.config.js';
import { POS_NAV, NAV_ICONS } from '../../components/PosPageShell.jsx';
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

function Card({ title, icon, children, className }) {
  return (
    <section className={cn('rounded-lg border border-gray-200 bg-white p-4', className)}>
      <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-gray-900">
        <span className="text-blue-600">{icon}</span>
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
  const [tipInput, setTipInput] = useState('');
  const [notes, setNotes] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');
  const [upiAmount, setUpiAmount] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const [processing, setProcessing] = useState(false);
  const [holdConfirm, setHoldConfirm] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const tipRef = useRef(null);

  const tip = Number(tipInput) > 0 ? Number(tipInput) : 0;
  const grandTotal = cartTotals.total + tip;
  const isSplit = method === PAYMENT_METHODS.SPLIT;
  const splitTotal = (Number(cashAmount) || 0) + (Number(cardAmount) || 0) + (Number(upiAmount) || 0);
  const splitValid = Math.abs(splitTotal - grandTotal) < 0.01;
  const cashShort = method === PAYMENT_METHODS.CASH && !isSplit && cashReceived !== '' && Number(cashReceived) < grandTotal;

  const canComplete = useMemo(
    () => cart.length > 0 && !processing && (!isSplit || splitValid) && !cashShort,
    [cart.length, processing, isSplit, splitValid, cashShort]
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
            tip,
            notes: notes.trim(),
            payments: [
              { method: PAYMENT_METHODS.CASH, amount: Number(cashAmount) || 0 },
              { method: PAYMENT_METHODS.CARD, amount: Number(cardAmount) || 0 },
              { method: PAYMENT_METHODS.UPI, amount: Number(upiAmount) || 0 },
            ].filter((p) => p.amount > 0),
          }
        : {
            method,
            tip,
            notes: notes.trim(),
            cashReceived: method === PAYMENT_METHODS.CASH ? Number(cashReceived) || 0 : 0,
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
        tipRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (cart.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#f4f6f9]">
        <p className="text-lg font-semibold text-gray-900">No items to check out</p>
        <p className="text-sm text-gray-500">Add products from New Sale first.</p>
        <button
          type="button"
          onClick={() => navigate(`${base}/new-sale`)}
          className="mt-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to New Sale
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#f4f6f9]">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4">
        <span className="flex items-center gap-2">
          <svg viewBox="0 0 36 36" className="h-8 w-8">
            <path d="M18 2 32 10v16L18 34 4 26V10L18 2z" fill="#2563eb" />
            <path d="M18 2 32 10 18 18 4 10 18 2z" fill="#60a5fa" />
            <path d="M18 18v16L4 26V10l14 8z" fill="#1d4ed8" />
            <path d="M18 18v16l14-8V10l-14 8z" fill="#3b82f6" />
          </svg>
          <span className="text-[20px] font-bold tracking-tight text-gray-900">OnePos</span>
        </span>
        <span className="h-6 w-px bg-gray-300" />
        <h1 className="text-[16px] font-semibold text-gray-900">Checkout</h1>
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setCustomerModal(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-800 hover:border-gray-400"
          >
            <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="max-w-[160px] truncate">{selectedCustomer?.name || 'Walk-in Customer'}</span>
            <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Left nav */}
        <aside className="flex w-[188px] shrink-0 flex-col border-r border-gray-200 bg-white px-2 py-2">
          <nav className="flex-1 space-y-0.5">
            {POS_NAV.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition-colors',
                    isActive ? 'bg-blue-600 font-semibold text-white' : 'text-gray-700 hover:bg-gray-100'
                  )
                }
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  {NAV_ICONS[item.icon]}
                </svg>
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] text-gray-700 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </aside>

        {/* Main content */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_300px] items-start gap-4">
            <div className="min-w-0 space-y-4">
              <Card
                title="Customer Information"
                icon={
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                  </svg>
                }
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50">
                    <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-bold text-gray-900">{selectedCustomer?.name || 'Walk-in Customer'}</p>
                    <p className="text-[12.5px] text-gray-500">Phone: {selectedCustomer?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomerModal(true)}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-500 px-3 py-2 text-[13.5px] font-semibold text-blue-600 hover:bg-blue-50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit / Add Customer
                </button>
              </Card>

              <Card
                title="Order Summary"
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9h4m-4 4h4" />
                  </svg>
                }
              >
                <div className="overflow-hidden rounded-md border border-gray-200">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="bg-gray-50 text-left text-gray-600">
                        <th className="px-3 py-2 font-medium">Item</th>
                        <th className="px-3 py-2 text-right font-medium">Unit Price</th>
                        <th className="px-3 py-2 text-center font-medium">Qty</th>
                        <th className="px-3 py-2 text-right font-medium">Line Total</th>
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
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path strokeLinecap="round" d="M2 10h20" />
                  </svg>
                }
              >
                <div className="grid grid-cols-5 gap-2">
                  {PAY_OPTIONS.map((opt) => {
                    const selected = method === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setMethod(opt.id)}
                        className={cn(
                          'relative flex flex-col items-center gap-1 rounded-lg border px-2 py-3 text-[12px] font-medium transition-colors',
                          selected
                            ? 'border-blue-600 bg-blue-50 text-gray-900'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        )}
                      >
                        {selected && (
                          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                            ✓
                          </span>
                        )}
                        <span className={selected ? 'text-blue-700' : 'text-gray-600'}>{opt.icon}</span>
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
                        className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
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
                        className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
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
                        className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </label>
                    <p className={cn('col-span-3 text-[12px]', splitValid ? 'text-green-600' : 'text-red-500')}>
                      Split total: {formatCurrency(splitTotal)} / {formatCurrency(grandTotal)}
                    </p>
                  </div>
                )}

                {!isSplit && method === PAYMENT_METHODS.CASH && (
                  <div className="mt-3 rounded-lg border border-gray-200 p-3">
                    <label className="text-[13px] font-semibold text-gray-800">Cash Received</label>
                    <input
                      type="number"
                      min="0"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      placeholder={grandTotal.toFixed(2)}
                      className="mt-2 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    {cashReceived !== '' && Number(cashReceived) >= grandTotal && (
                      <p className="mt-1.5 text-[12px] font-medium text-green-600">
                        Change Due: {formatCurrency(Number(cashReceived) - grandTotal)}
                      </p>
                    )}
                    {cashShort && (
                      <p className="mt-1.5 text-[12px] font-medium text-red-500">
                        Received amount is less than the total.
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-gray-200 p-3">
                    <label className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-800">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-blue-500 text-[11px] font-bold text-blue-600">₹</span>
                      Optional Tip
                    </label>
                    <input
                      ref={tipRef}
                      type="number"
                      min="0"
                      value={tipInput}
                      onChange={(e) => setTipInput(e.target.value)}
                      placeholder="₹0.00"
                      className="mt-2 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <p className="mt-1.5 text-center text-[11.5px] text-gray-500">Enter tip amount (optional)</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3">
                    <label className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-800">
                      <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                      </svg>
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any notes for this sale (optional)"
                      rows={2}
                      className="mt-2 w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <p className="mt-1 text-[11.5px] text-gray-500">Visible in order details</p>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`${base}/new-sale`)}
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 text-[13.5px] font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => setHoldConfirm(true)}
                    disabled={cart.length === 0}
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 text-[13.5px] font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-blue-500 text-[11px] font-bold text-blue-600">⏸</span>
                    Hold Sale
                  </button>
                  <button
                    type="button"
                    onClick={doComplete}
                    disabled={!canComplete}
                    className="flex h-11 flex-[1.6] items-center justify-center gap-2 rounded-lg bg-blue-600 text-[14px] font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {processing ? 'Processing...' : 'Complete Payment'}
                  </button>
                </div>
              </Card>
            </div>

            <Card
              className="sticky top-0"
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
                  <dt className="text-gray-700">Subtotal</dt>
                  <dd className="font-medium text-gray-900">{formatCurrency(cartTotals.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-700">Tax (8%)</dt>
                  <dd className="font-medium text-gray-900">{formatCurrency(cartTotals.tax)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-700">Discount</dt>
                  <dd className="font-medium text-gray-900">{formatCurrency(billDiscount)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-700">Optional Tip</dt>
                  <dd className="font-medium text-gray-900">{formatCurrency(tip)}</dd>
                </div>
              </dl>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-[16px] font-bold text-green-600">Total</span>
                <span className="text-[22px] font-bold text-green-600">{formatCurrency(grandTotal)}</span>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Shortcut footer */}
      <footer className="flex h-9 shrink-0 items-center gap-5 overflow-x-auto border-t border-gray-200 bg-white px-4">
        <span className="flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-gray-700">
          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path strokeLinecap="round" d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M9 13h6" strokeWidth={2} />
          </svg>
          Keyboard Shortcuts
        </span>
        <span className="h-4 w-px shrink-0 bg-gray-300" />
        {FOOT_SHORTCUTS.map((s) => (
          <span key={s.key} className="flex shrink-0 items-center gap-1.5 text-[12px]">
            <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-gray-700">
              {s.key}
            </kbd>
            <span className="text-gray-600">{s.label}</span>
          </span>
        ))}
      </footer>

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
