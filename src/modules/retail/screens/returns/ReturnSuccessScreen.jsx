import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { retailConfig } from '../../config/retail.config.js';
import { PosPageShell, CustomerPill, POS_NAV } from '../../components/PosPageShell.jsx';
import { LAST_RETURN_KEY } from './ReturnsScreen.jsx';

const base = retailConfig.routePrefix;

const METHOD_LABELS = { cash: 'Cash', card: 'Card', store_credit: 'Store Credit' };

function resolveReturn(returns, returnId) {
  const found = returns.find((r) => r.id === returnId);
  if (found) return found;
  try {
    const raw = localStorage.getItem(LAST_RETURN_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && (!returnId || parsed.id === returnId)) return parsed;
  } catch {
    // ignore
  }
  return null;
}

export function ReturnSuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { returns, sales } = useCashier();

  const ret = resolveReturn(returns, location.state?.returnId);
  const sale = sales.find((s) => s.id === ret?.saleId);
  const itemCount = ret ? ret.items.reduce((s, i) => s + i.quantity, 0) : 0;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        window.print();
      } else if (e.key === 'F4') {
        e.preventDefault();
        navigate(`${base}/returns`);
      } else if (e.key === 'Escape' || e.key === 'F1') {
        e.preventDefault();
        navigate(`${base}/sales`);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  if (!ret) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#f4f6f9]">
        <p className="text-lg font-semibold text-gray-900">No processed return found</p>
        <button
          type="button"
          onClick={() => navigate(`${base}/returns`)}
          className="mt-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to Returns
        </button>
      </div>
    );
  }

  return (
    <PosPageShell
      title={<h1 className="text-[20px] font-bold text-gray-900">Return Processed</h1>}
      topRight={<CustomerPill />}
      navItems={POS_NAV}
      footer={null}
      shortcuts={[
        { key: 'F1', label: 'Help' },
        { key: 'F2', label: 'Print' },
        { key: 'F3', label: 'Email' },
        { key: 'F4', label: 'New Return' },
        { key: 'Esc', label: 'Close' },
      ]}
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center px-4 pt-6 text-center">
        <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-green-200/70 ring-8 ring-green-100">
          <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <h2 className="mt-4 text-[24px] font-bold text-gray-900">Return Processed Successfully</h2>
        <p className="mt-1.5 text-[14px] text-gray-500">
          Refund of {formatCurrency(ret.refundAmount)} has been issued to {METHOD_LABELS[ret.refundMethod] || ret.refundMethod}.
        </p>

        <div className="mt-5 w-full rounded-xl border border-gray-200 bg-white px-5 py-2 text-left text-[13.5px]">
          <div className="flex items-center justify-between border-b border-gray-100 py-2.5">
            <div>
              <p className="text-gray-500">Invoice #</p>
              <p className="font-medium text-gray-900">{ret.saleId}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Items returned</p>
              <p className="font-medium text-gray-900">{itemCount}</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-b border-gray-100 py-2.5">
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium text-gray-900">{new Date(ret.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Refund Method</p>
              <p className="font-medium text-gray-900">{METHOD_LABELS[ret.refundMethod] || ret.refundMethod}</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <div>
              <p className="text-gray-500">Customer</p>
              <p className="font-medium text-gray-900">{sale?.customerName || 'Walk-in Customer'}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Refund Amount</p>
              <p className="text-[20px] font-bold text-blue-600">{formatCurrency(ret.refundAmount)}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid w-full grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-[13.5px] font-semibold text-gray-800 hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print Receipt
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-[13.5px] font-semibold text-gray-800 hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            Email Receipt
          </button>
          <button
            type="button"
            onClick={() => navigate(`${base}/returns`)}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 text-[13.5px] font-semibold text-white hover:bg-blue-700"
          >
            <span className="text-[18px] font-bold leading-none">+</span>
            New Return
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate(`${base}/sales`)}
          className="mt-3 text-[13.5px] font-medium text-gray-500 hover:text-gray-800 hover:underline"
        >
          Back to Sales
        </button>
      </div>
    </PosPageShell>
  );
}
