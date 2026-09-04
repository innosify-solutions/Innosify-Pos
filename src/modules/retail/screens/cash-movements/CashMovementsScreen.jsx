import { useMemo, useState } from 'react';
import { formatCurrency } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { retailConfig } from '../../config/retail.config.js';

const base = retailConfig.routePrefix;

const IN_REASONS = ['Opening Float', 'Bank Deposit', 'Misc. Income', 'Other Income'];
const OUT_REASONS = ['Petty Cash', 'Expense', 'Bank Withdrawal', 'Other Expense'];

const REASON_STYLES = {
  'Opening Float': 'bg-green-50 text-green-700',
  'Bank Deposit': 'bg-green-50 text-green-700',
  'Misc. Income': 'bg-green-50 text-green-700',
  'Petty Cash': 'bg-red-50 text-red-600',
  Expense: 'bg-red-50 text-red-600',
};

function MovementForm({ type, onAdd }) {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const isIn = type === 'in';
  const reasons = isIn ? IN_REASONS : OUT_REASONS;

  const submit = () => {
    const value = Number(amount);
    if (!reason || !(value > 0)) return;
    onAdd({ type, reason, amount: value, notes: notes.trim() });
    setReason('');
    setAmount('');
    setNotes('');
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className={`flex items-center gap-2 rounded-t-xl px-4 py-3 ${isIn ? 'bg-green-50/70' : 'bg-red-50/70'}`}>
        <span className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${isIn ? 'bg-green-600' : 'bg-red-500'}`}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
            <path strokeLinecap="round" strokeLinejoin="round" d={isIn ? 'M12 5v14m0 0l-5-5m5 5l5-5' : 'M12 19V5m0 0l-5 5m5-5l5 5'} />
          </svg>
        </span>
        <h3 className="text-[15px] font-bold text-gray-900">{isIn ? 'Cash In' : 'Cash Out'}</h3>
        <p className="text-[12px] text-gray-500">
          {isIn ? 'Record money added to the cash drawer.' : 'Record money removed from the cash drawer.'}
        </p>
      </div>
      <div className="space-y-3 p-4">
        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-3">
          <label className="text-[13px] font-semibold text-gray-800">Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-[13px] text-gray-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select reason</option>
            {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-3">
          <label className="text-[13px] font-semibold text-gray-800">Amount (₹)</label>
          <span className="relative block">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-500">₹</span>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="h-10 w-full rounded-lg border border-gray-300 pl-7 pr-3 text-[13px] focus:border-blue-500 focus:outline-none"
            />
          </span>
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-gray-800">
            Notes <span className="font-normal text-gray-500">(Optional)</span>
          </label>
          <textarea
            value={notes}
            maxLength={200}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={isIn ? 'Enter notes about this cash in...' : 'Enter notes about this cash out...'}
            rows={2}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-[13px] placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
          />
          <p className="text-right text-[11px] text-gray-400">{notes.length}/200</p>
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={!reason || !(Number(amount) > 0)}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-[14px] font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[13px] font-bold leading-none">+</span>
          Add Movement
        </button>
      </div>
    </div>
  );
}

export function CashMovementsScreen() {
  const { cashMovements, addCashMovement, shift, sales } = useCashier();

  const { cashIn, cashOut, cashSalesTotal } = useMemo(() => {
    let cashIn = 0;
    let cashOut = 0;
    cashMovements.forEach((m) => {
      if (m.type === 'in') cashIn += m.amount;
      else cashOut += m.amount;
    });
    const cashSalesTotal = sales
      .filter((s) => s.paymentMethod === 'cash' && s.status !== 'voided')
      .reduce((sum, s) => sum + s.total, 0);
    return { cashIn, cashOut, cashSalesTotal };
  }, [cashMovements, sales]);

  const drawerBalance = (shift.openingCash || 0) + cashSalesTotal + cashIn - cashOut;

  const sorted = useMemo(
    () => [...cashMovements].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    [cashMovements]
  );

  const todayLabel = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const shiftTime = new Date(shift.openedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <p className="text-[13px] text-gray-500">Record cash in and cash out movements for the current shift.</p>
        <p className="text-[12.5px] font-medium text-gray-600">
          Shift: <span className="font-bold text-gray-900">Shift 1</span> &nbsp;•&nbsp; {shiftTime} – Ongoing
        </p>
      </div>

      <div className="grid grid-cols-2 items-start gap-3">
        <MovementForm type="in" onAdd={addCashMovement} />
        <MovementForm type="out" onAdd={addCashMovement} />
      </div>

      <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[15px] font-bold text-gray-900">Recent Cash Movements</h3>
          <span className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-gray-700">
            Current Cash in Drawer: <span className="font-bold text-green-600">{formatCurrency(drawerBalance)}</span>
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-600">
                <th className="px-3 py-2.5 font-semibold">Date/Time</th>
                <th className="px-3 py-2.5 font-semibold">Type</th>
                <th className="px-3 py-2.5 font-semibold">Reason</th>
                <th className="px-3 py-2.5 font-semibold">Amount</th>
                <th className="px-3 py-2.5 font-semibold">User</th>
                <th className="px-3 py-2.5 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m) => (
                <tr key={m.id} className="border-t border-gray-100">
                  <td className="whitespace-nowrap px-3 py-2.5 text-gray-700">
                    {new Date(m.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })},{' '}
                    {new Date(m.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded-md px-2.5 py-1 text-[12px] font-semibold ${m.type === 'in' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {m.type === 'in' ? 'In' : 'Out'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded-md px-2.5 py-1 text-[12px] font-medium ${REASON_STYLES[m.reason] || 'bg-gray-100 text-gray-600'}`}>
                      {m.reason}
                    </span>
                  </td>
                  <td className={`whitespace-nowrap px-3 py-2.5 font-semibold ${m.type === 'in' ? 'text-green-600' : 'text-red-500'}`}>
                    {formatCurrency(m.amount)}
                  </td>
                  <td className="px-3 py-2.5 text-gray-800">{m.performedBy}</td>
                  <td className="px-3 py-2.5 text-gray-600">{m.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && (
            <p className="border-t border-gray-100 py-10 text-center text-sm text-gray-500">No cash movements yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
