import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { retailConfig } from '../../config/retail.config.js';
import { ReceiptModal } from '../new-sale/SaleCompleteModal';
import { LAST_SALE_KEY } from './CheckoutScreen.jsx';

const base = retailConfig.routePrefix;

const METHOD_LABELS = {
  cash: 'Cash',
  card: 'Credit/Debit Card',
  upi: 'UPI',
  wallet: 'Wallet',
  split: 'Split Payment',
};

const BLAST_COLORS = ['#16a34a', '#059669', '#f59e0b', '#fbbf24', '#34d399', '#a7f3d0', '#065f46', '#f97316'];

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

function SuccessBlast() {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.3;
        const dist = 70 + Math.random() * 65;
        return {
          tx: `${(Math.cos(angle) * dist).toFixed(1)}px`,
          ty: `${(Math.sin(angle) * dist).toFixed(1)}px`,
          rot: `${Math.round(Math.random() * 360)}deg`,
          color: BLAST_COLORS[i % BLAST_COLORS.length],
          size: Math.round(5 + Math.random() * 5),
          delay: `${(Math.random() * 0.15).toFixed(2)}s`,
          round: Math.random() > 0.5,
        };
      }),
    []
  );

  return (
    <div aria-hidden="true" className="relative mx-auto flex h-40 w-40 items-center justify-center">
      <span className="animate-blast-ring absolute inset-2 rounded-full border-4 border-green-500" />
      <span className="animate-blast-ring absolute inset-2 rounded-full border-2 border-amber-400" style={{ animationDelay: '0.25s' }} />
      {particles.map((p, i) => (
        <span
          key={i}
          className="blast-particle absolute"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.round ? '999px' : '2px',
            animationDelay: p.delay,
            '--tx': p.tx,
            '--ty': p.ty,
            '--rot': p.rot,
          }}
        />
      ))}
      <span className="animate-success-pop flex h-20 w-20 items-center justify-center rounded-full bg-green-600 shadow-[0_10px_30px_rgba(22,163,74,0.5)]">
        <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path className="success-check" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    </div>
  );
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
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-lg font-semibold text-gray-900">No completed sale found</p>
        <button
          type="button"
          onClick={() => navigate(`${base}/new-sale`)}
          className="mt-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
        >
          Back to New Sale
        </button>
      </div>
    );
  }

  return (
    <div className="thin-scroll flex h-full flex-col items-center overflow-y-auto p-4">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-3xl border border-gray-200 bg-white px-8 pb-6 pt-4 text-center shadow-[0_10px_36px_rgba(16,24,40,0.1)]">
          <SuccessBlast />
          <div role="status" aria-live="polite">
            <h2 className="mt-2 text-[28px] font-bold tracking-tight text-gray-900">Payment Successful!</h2>
            <p className="mt-1 text-[13.5px] text-gray-500">
              {formatCurrency(sale.total)} received via {METHOD_LABELS[sale.paymentMethod] || sale.paymentMethod} — transaction completed successfully.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-8 border-t border-gray-100 pt-5 text-left text-[13.5px]">
            <dl className="space-y-2.5">
              <div className="flex gap-6">
                <dt className="w-32 shrink-0 text-gray-500">Order ID</dt>
                <dd className="font-semibold text-gray-900">{sale.id}</dd>
              </div>
              <div className="flex gap-6">
                <dt className="w-32 shrink-0 text-gray-500">Date & Time</dt>
                <dd className="font-semibold text-gray-900">{formatDate(sale.date)}</dd>
              </div>
              <div className="flex gap-6">
                <dt className="w-32 shrink-0 text-gray-500">Customer</dt>
                <dd className="truncate font-semibold text-gray-900">{sale.customerName}</dd>
              </div>
              <div className="flex gap-6">
                <dt className="w-32 shrink-0 text-gray-500">Payment Method</dt>
                <dd className="font-semibold text-gray-900">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12.5px] font-semibold capitalize text-emerald-700">
                    {METHOD_LABELS[sale.paymentMethod] || sale.paymentMethod}
                  </span>
                </dd>
              </div>
            </dl>
            <dl className="space-y-2.5">
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-semibold text-gray-900">{formatCurrency(sale.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Tax (8%)</dt>
                <dd className="font-semibold text-gray-900">{formatCurrency(sale.tax)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-2.5">
                <dt className="text-[15px] font-bold text-gray-900">Total Paid</dt>
                <dd className="text-[22px] font-bold text-green-700">{formatCurrency(sale.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-emerald-50/70 px-6 py-4 text-left">
            <div>
              <p className="text-[12.5px] font-medium uppercase tracking-wide text-emerald-700">Amount Received</p>
              <p className="text-[26px] font-bold leading-tight text-gray-900">{formatCurrency(sale.amountReceived ?? sale.total)}</p>
            </div>
            <div className="h-12 w-px bg-emerald-200" aria-hidden="true" />
            <div className="text-right">
              <p className="text-[12.5px] font-medium uppercase tracking-wide text-emerald-700">Change Due</p>
              <p className="text-[26px] font-bold leading-tight text-green-700">{formatCurrency(sale.changeDue ?? 0)}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white text-[13.5px] font-semibold text-gray-800 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1"
          >
            <svg aria-hidden="true" className="h-5 w-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Receipt
          </button>
          <button
            type="button"
            onClick={() => setReceiptOpen(true)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white text-[13.5px] font-semibold text-gray-800 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1"
          >
            <svg aria-hidden="true" className="h-5 w-5 text-emerald-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
            </svg>
            Email / SMS Receipt
          </button>
          <button
            type="button"
            onClick={() => navigate(`${base}/new-sale`)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 text-[14px] font-bold text-white shadow-[0_2px_8px_rgba(22,163,74,0.4)] hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
          >
            <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[13px] font-bold leading-none">+</span>
            New Sale
          </button>
        </div>

        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setReceiptOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[13.5px] font-semibold text-emerald-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            View Order Details
            <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
    </div>
  );
}
