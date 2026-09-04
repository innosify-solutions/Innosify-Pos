import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { retailConfig } from '../../config/retail.config.js';
import { ReceiptModal } from '../new-sale/SaleCompleteModal';
import { LAST_SALE_KEY } from './CheckoutScreen.jsx';
import { PosPageShell, CustomerPill, POS_NAV } from '../../components/PosPageShell.jsx';

const base = retailConfig.routePrefix;

const METHOD_LABELS = {
  cash: 'Cash',
  card: 'Credit/Debit Card',
  upi: 'UPI',
  wallet: 'Wallet',
  split: 'Split Payment',
};

function resolveSale(sales, saleId) {
  const found = sales.find((s) => s.id === saleId);
  if (found) return found;
  try {
    const raw = localStorage.getItem(LAST_SALE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && (!saleId || parsed.id === saleId)) return parsed;
  } catch {
    // ignore
  }
  return null;
}

export function PaymentSuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sales } = useCashier();
  const [receiptOpen, setReceiptOpen] = useState(false);

  const sale = resolveSale(sales, location.state?.saleId);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'F2' || e.key === 'Escape' || e.key === 'F4') {
        e.preventDefault();
        navigate(`${base}/new-sale`);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  if (!sale) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#f4f6f9]">
        <p className="text-lg font-semibold text-gray-900">No completed sale found</p>
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
    <PosPageShell
      title={
        <span className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9h4m-4 4h4" />
            </svg>
          </span>
          <span>
            <span className="block text-[16px] font-bold leading-tight text-gray-900">Payment Complete</span>
            <span className="block text-[12px] font-normal leading-tight text-gray-500">Checkout</span>
          </span>
        </span>
      }
      topRight={<CustomerPill />}
      navItems={POS_NAV}
      footer="terminal"
      shortcutLabel="Keyboard Shortcuts"
      shortcuts={[
        { key: 'F2', label: 'New Sale' },
        { key: 'F4', label: 'Search Product' },
        { key: 'F6', label: 'Customer' },
        { key: 'F8', label: 'Payment' },
        { key: 'Esc', label: 'Cancel Sale' },
      ]}
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-xl border border-gray-200 bg-white px-8 pb-6 pt-6 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
            <svg className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <h2 className="mt-3 text-[26px] font-bold text-gray-900">Payment Successful!</h2>
          <p className="mt-1 text-[13.5px] text-gray-500">Transaction completed successfully.</p>

          <div className="mt-5 grid grid-cols-2 gap-8 border-t border-gray-100 pt-5 text-left text-[13.5px]">
            <dl className="space-y-2.5">
              <div className="flex gap-6">
                <dt className="w-32 shrink-0 text-gray-600">Order ID</dt>
                <dd className="font-medium text-gray-900">{sale.id}</dd>
              </div>
              <div className="flex gap-6">
                <dt className="w-32 shrink-0 text-gray-600">Date & Time</dt>
                <dd className="font-medium text-gray-900">{formatDate(sale.date)}</dd>
              </div>
              <div className="flex gap-6">
                <dt className="w-32 shrink-0 text-gray-600">Customer</dt>
                <dd className="font-medium text-gray-900">{sale.customerName}</dd>
              </div>
              <div className="flex gap-6">
                <dt className="w-32 shrink-0 text-gray-600">Payment Method</dt>
                <dd className="font-medium capitalize text-gray-900">{METHOD_LABELS[sale.paymentMethod] || sale.paymentMethod}</dd>
              </div>
            </dl>
            <dl className="space-y-2.5">
              <div className="flex justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium text-gray-900">{formatCurrency(sale.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Tax (8%)</dt>
                <dd className="font-medium text-gray-900">{formatCurrency(sale.tax)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
                <dt className="text-[15px] font-bold text-gray-900">Total Paid</dt>
                <dd className="text-[20px] font-bold text-blue-600">{formatCurrency(sale.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-4 text-left">
            <div>
              <p className="text-[13px] text-gray-600">Amount Received</p>
              <p className="text-[26px] font-bold text-gray-900">{formatCurrency(sale.amountReceived ?? sale.total)}</p>
            </div>
            <div className="text-right">
              <p className="text-[13px] text-gray-600">Change Due</p>
              <p className="text-[26px] font-bold text-green-600">{formatCurrency(sale.changeDue ?? 0)}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-[13.5px] font-semibold text-gray-800 hover:bg-gray-50"
          >
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Receipt
          </button>
          <button
            type="button"
            onClick={() => setReceiptOpen(true)}
            className="flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-[13.5px] font-semibold text-gray-800 hover:bg-gray-50"
          >
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 00-9.95 9h-.05v2l2 2v-2.05A8 8 0 114 12h2a6 6 0 106-6V4.41L9.41 7 12 9.59 14.59 7 12 4.41V6a8 8 0 00-2-1.5V2h2z" opacity="0" />
              <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
            </svg>
            Email / SMS Receipt
          </button>
          <button
            type="button"
            onClick={() => navigate(`${base}/new-sale`)}
            className="flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 text-[14px] font-semibold text-white hover:bg-blue-700"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[13px] font-bold leading-none">+</span>
            New Sale
          </button>
        </div>

        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setReceiptOpen(true)}
            className="inline-flex items-center gap-1 text-[13.5px] font-medium text-blue-600 hover:underline"
          >
            View Order Details
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <ReceiptModal
        open={receiptOpen}
        sale={sale}
        onClose={() => setReceiptOpen(false)}
        onNewSale={() => navigate(`${base}/new-sale`)}
      />
    </PosPageShell>
  );
}
