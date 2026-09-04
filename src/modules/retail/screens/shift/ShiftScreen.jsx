import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmationDialog } from '@shared/dialogs/ConfirmationDialog';
import { formatCurrency } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { retailConfig } from '../../config/retail.config.js';
import { PosPageShell, POS_NAV } from '../../components/PosPageShell.jsx';

const base = retailConfig.routePrefix;

const METHOD_PILLS = {
  cash: 'bg-green-50 text-green-700',
  card: 'bg-purple-50 text-purple-700',
  upi: 'bg-blue-50 text-blue-700',
  wallet: 'bg-amber-50 text-amber-700',
  split: 'bg-gray-100 text-gray-600',
};

function MiniTile({ icon, label, value, valueClass }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-2.5 text-center">
      <p className="flex items-center justify-center gap-1 text-[11px] text-gray-500">
        {icon}
        {label}
      </p>
      <p className={`mt-1 text-[15px] font-bold ${valueClass || 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

export function ShiftScreen() {
  const navigate = useNavigate();
  const { shift, sales, cashMovements, closeShift } = useCashier();
  const [endConfirm, setEndConfirm] = useState(false);

  const stats = useMemo(() => {
    const valid = sales.filter((s) => s.status !== 'voided');
    const byMethod = (m) => valid.filter((s) => s.paymentMethod === m).reduce((sum, s) => sum + s.total, 0);
    const cashSales = byMethod('cash');
    const cardSales = byMethod('card');
    const upiSales = byMethod('upi');
    let added = 0;
    let removed = 0;
    cashMovements.forEach((m) => {
      if (m.type === 'in' && m.reason !== 'Opening Float') added += m.amount;
      if (m.type === 'out') removed += m.amount;
    });
    const expected = (shift.openingCash || 0) + cashSales + added - removed;
    return {
      totalSales: valid.reduce((s, x) => s + x.total, 0),
      transactions: valid.length,
      cashSales,
      cardSales,
      upiSales,
      added,
      removed,
      expected,
    };
  }, [sales, cashMovements, shift.openingCash]);

  const recent = useMemo(
    () => [...sales].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [sales]
  );

  const now = new Date();
  const nowTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const nowDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const shiftStart = new Date(shift.openedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const handleEndShift = () => {
    closeShift({ countedCash: stats.expected, variance: 0 });
    setEndConfirm(false);
  };

  return (
    <PosPageShell
      title={<h1 className="text-[20px] font-bold text-gray-900">Current Shift</h1>}
      topRight={
        <>
          <span className="text-[13px] font-medium text-gray-600">{nowTime}</span>
          <span className="h-4 w-px bg-gray-300" />
          <span className="text-[13px] font-medium text-gray-600">{nowDate}</span>
          <button type="button" aria-label="Notifications" className="relative rounded-lg p-1.5 hover:bg-gray-100">
            <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">2</span>
          </button>
        </>
      }
      navItems={POS_NAV}
      footer="cashier"
    >
      <h2 className="text-[22px] font-bold text-gray-900">Current Shift</h2>
      <p className="mb-3 text-[13px] text-gray-500">View and manage your ongoing shift.</p>

      {shift.status === 'closed' ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
          <p className="text-[16px] font-bold text-green-800">Shift Closed</p>
          <p className="mt-1 text-[13px] text-green-700">
            Closed at {shift.closedAt ? new Date(shift.closedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
            {' '}• Closing cash {formatCurrency(shift.closingCash || 0)}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 divide-x divide-gray-200 rounded-xl border border-gray-200 bg-white px-2 py-4">
            {[
              {
                icon: <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                label: 'Shift Started', value: shiftStart,
              },
              {
                icon: <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
                label: 'Cashier', value: shift.openedBy,
              },
              {
                icon: <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2 2 0 00-2-2h-4a2 2 0 100 4h4a2 2 0 002-2zM3 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>,
                label: 'Opening Float', value: formatCurrency(shift.openingCash),
              },
              {
                icon: <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>,
                label: 'Expected Cash', value: formatCurrency(stats.expected), blue: true,
              },
            ].map((cell) => (
              <div key={cell.label} className="flex items-center justify-center gap-2.5 px-4">
                {cell.icon}
                <div>
                  <p className="text-[12.5px] text-gray-500">{cell.label}</p>
                  <p className={`text-[19px] font-bold ${cell.blue ? 'text-blue-600' : 'text-gray-900'}`}>{cell.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_270px] items-start gap-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-gray-900">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Sales Summary
              </h3>
              <div className="grid grid-cols-5 gap-2">
                <MiniTile
                  label="Total Sales" value={formatCurrency(stats.totalSales)} valueClass="text-blue-600"
                  icon={<svg className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <MiniTile
                  label="Total Transactions" value={stats.transactions}
                  icon={<svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                />
                <MiniTile
                  label="Cash Sales" value={formatCurrency(stats.cashSales)} valueClass="text-green-600"
                  icon={<svg className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>}
                />
                <MiniTile
                  label="Card Sales" value={formatCurrency(stats.cardSales)} valueClass="text-purple-700"
                  icon={<svg className="h-3.5 w-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="5" width="20" height="14" rx="2" /><path strokeLinecap="round" d="M2 10h20" /></svg>}
                />
                <MiniTile
                  label="UPI" value={formatCurrency(stats.upiSales)} valueClass="text-orange-600"
                  icon={<svg className="h-3.5 w-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>}
                />
              </div>
              <div className="mt-1 text-right">
                <button type="button" onClick={() => navigate(`${base}/sales`)} className="text-[12.5px] font-medium text-blue-600 hover:underline">
                  View All
                </button>
              </div>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="bg-gray-50 text-left text-[11.5px] uppercase tracking-wide text-gray-500">
                      <th className="px-3 py-2 font-semibold">Time</th>
                      <th className="px-3 py-2 font-semibold">Invoice #</th>
                      <th className="px-3 py-2 font-semibold">Amount</th>
                      <th className="px-3 py-2 font-semibold">Payment Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((s) => (
                      <tr key={s.id} className="border-t border-gray-100">
                        <td className="px-3 py-2 text-gray-700">{new Date(s.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                        <td className="px-3 py-2 text-gray-700">INV-{s.id.replace(/\D/g, '').slice(-6) || s.id}</td>
                        <td className="px-3 py-2 font-medium text-gray-900">{formatCurrency(s.total)}</td>
                        <td className="px-3 py-2">
                          <span className={`rounded-md px-2.5 py-1 text-[11.5px] font-bold uppercase ${METHOD_PILLS[s.paymentMethod] || 'bg-gray-100 text-gray-600'}`}>
                            {s.paymentMethod === 'card' ? 'Card' : s.paymentMethod}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" onClick={() => navigate(`${base}/sales`)} className="mt-2.5 flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:underline">
                View All Transactions
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="mb-2.5 flex items-center gap-2 text-[14px] font-bold text-gray-900">
                  <svg className="h-4.5 w-4.5 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2 2 0 00-2-2h-4a2 2 0 100 4h4a2 2 0 002-2zM3 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  </svg>
                  Cash Drawer Status
                </h3>
                <p className="text-[12.5px] text-gray-500">Current Cash</p>
                <p className="text-[22px] font-bold text-blue-600">{formatCurrency(stats.expected)}</p>
                <dl className="mt-2 space-y-1.5 border-t border-gray-100 pt-2 text-[12.5px]">
                  <div className="flex justify-between"><dt className="text-gray-600">Opening Float</dt><dd className="font-medium">{formatCurrency(shift.openingCash)}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-600">Cash Sales</dt><dd className="font-medium">{formatCurrency(stats.cashSales)}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-600">Cash Added</dt><dd className="font-medium">{formatCurrency(stats.added)}</dd></div>
                  <div className="flex justify-between"><dt className="text-red-500">Cash Removed</dt><dd className="font-medium text-red-500">-{formatCurrency(stats.removed)}</dd></div>
                </dl>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="mb-2.5 flex items-center gap-2 text-[14px] font-bold text-gray-900">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <path strokeLinecap="round" d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01" strokeWidth={2} />
                  </svg>
                  Shift Actions
                </h3>
                <button
                  type="button"
                  onClick={() => setEndConfirm(true)}
                  className="flex w-full flex-col items-center gap-0.5 rounded-lg bg-blue-600 py-2.5 text-white hover:bg-blue-700"
                >
                  <span className="flex items-center gap-2 text-[15px] font-bold">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    End Shift
                  </span>
                  <span className="text-[11.5px] font-normal opacity-90">End the current shift and reconcile cash.</span>
                </button>
                <p className="mt-2.5 text-[12px] leading-relaxed text-gray-500">
                  You can review and finalize the shift details on the next screen.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <ConfirmationDialog
        open={endConfirm}
        onClose={() => setEndConfirm(false)}
        onConfirm={handleEndShift}
        title="End Shift"
        message={`Reconcile and close the current shift? Expected cash in drawer is ${formatCurrency(stats.expected)}.`}
        confirmLabel="End Shift"
      />
    </PosPageShell>
  );
}
