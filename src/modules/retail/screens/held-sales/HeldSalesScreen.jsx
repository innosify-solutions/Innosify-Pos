import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmationDialog } from '@shared/dialogs/ConfirmationDialog';
import { calculateCartTotals, formatCurrency } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { retailConfig } from '../../config/retail.config.js';

const base = retailConfig.routePrefix;

function formatHeldAt(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return { date, time };
}

export function HeldSalesScreen() {
  const navigate = useNavigate();
  const { heldSales, resumeHeldSale, deleteHeldSale, selectedCustomer } = useCashier();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const q = search.toLowerCase().trim();
  const filtered = heldSales.filter((h) => {
    if (!q) return true;
    const { date } = formatHeldAt(h.heldAt);
    return (
      h.id.toLowerCase().includes(q) ||
      (h.customerName || '').toLowerCase().includes(q) ||
      date.toLowerCase().includes(q)
    );
  });

  const handleResume = (id) => {
    if (resumeHeldSale(id)) navigate(`${base}/new-sale`);
  };

  const handleDelete = () => {
    if (deleteId) deleteHeldSale(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-[22px] font-bold text-gray-900">
            Held Sales
            <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[12px] font-semibold text-white">
              {heldSales.length} Held
            </span>
          </h2>
          <p className="mt-0.5 text-[13px] text-gray-500">View and manage your held sales. Resume to continue checkout.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, Customer, or Date"
              className="h-10 w-[300px] rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-[13px] focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="flex h-10 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h13M3 12h9m-9 6h6" />
            </svg>
            Filter
            <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-[11.5px] uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-semibold">Order ID</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Items</th>
              <th className="px-4 py-3 font-semibold">Total Amount</th>
              <th className="px-4 py-3 font-semibold">Held At</th>
              <th className="px-4 py-3 font-semibold">Held By</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((held) => {
              const itemCount = held.items.reduce((s, i) => s + i.quantity, 0);
              const totals = calculateCartTotals(held.items, held.billDiscount || 0);
              const { date, time } = formatHeldAt(held.heldAt);
              return (
                <tr key={held.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                  <td className="px-4 py-3 font-semibold text-blue-600">#{held.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{held.customerName}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-orange-50 px-2 py-1 text-[12px] font-medium text-gray-700">
                      {itemCount} item{itemCount === 1 ? '' : 's'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-green-600">{formatCurrency(totals.total)}</td>
                  <td className="px-4 py-3 text-gray-700">
                    <span className="block">{date}</span>
                    <span className="block text-gray-500">{time}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-gray-800">
                      <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                      </svg>
                      {held.heldBy || 'Cashier'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleResume(held.id)}
                        className="flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-[12.5px] font-semibold text-white hover:bg-blue-700"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414L12 9.172V13h3.828L21 7.828A2 2 0 0019.828 5h-2.172a2 2 0 00-1.414.586L11 10.828" />
                        </svg>
                        Resume
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(held.id)}
                        className="flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 text-[12.5px] font-semibold text-red-600 hover:bg-red-50"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="border-t border-gray-100 py-10 text-center text-sm text-gray-500">
            {heldSales.length === 0 ? 'No held sales. Hold a sale from New Sale to see it here.' : 'No held sales match your search.'}
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => navigate(`${base}/new-sale`)}
          className="flex h-11 items-center gap-2 rounded-lg border border-blue-200 bg-white px-5 text-[14px] font-semibold text-blue-600 hover:bg-blue-50"
        >
          <span className="text-[18px] font-bold leading-none">+</span>
          New Sale
        </button>
      </div>

      <ConfirmationDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Held Sale"
        message="This held sale will be permanently removed. This cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
