import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@utils/cn';
import { TAX_RATE } from '../../constants/cashier.constants.js';
import { formatCurrency } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { retailConfig } from '../../config/retail.config.js';
import { AddCustomerModal } from '../new-sale/AddCustomerModal';

const base = retailConfig.routePrefix;
export const LAST_RETURN_KEY = 'onepos-last-return-v1';

const REASONS = ['Defective / Wrong Size / Changed Mind / Other', 'Defective item', 'Wrong size', 'Changed mind', 'Other'];
const REFUND_METHODS = [
  { id: 'cash', label: 'Cash' },
  { id: 'card', label: 'Card' },
  { id: 'store_credit', label: 'Store Credit' },
];

const CATEGORY_EMOJI = { silk: '🥻', cotton: '🥻', banarasi: '🥻', kanjivaram: '🥻', chiffon: '🥻', georgette: '🥻', linen: '🥻', sarees: '🥻' };
const METHOD_LABELS = { cash: 'Cash', card: 'Card', store_credit: 'Store Credit' };

export function ReturnsScreen() {
  const navigate = useNavigate();
  const { sales, returns, products, processReturn } = useCashier();
  const [tab, setTab] = useState('find');
  const [search, setSearch] = useState('');
  const [activeSaleId, setActiveSaleId] = useState(sales[0]?.id || null);
  const [selected, setSelected] = useState({});
  const [reason, setReason] = useState(REASONS[0]);
  const [exchange, setExchange] = useState(false);
  const [refundMethod, setRefundMethod] = useState('cash');
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const searchRef = useRef(null);

  const productById = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);

  const matchingSales = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return sales;
    return sales.filter(
      (s) => s.id.toLowerCase().includes(q) || (s.customerName || '').toLowerCase().includes(q)
    );
  }, [sales, search]);

  const sale = sales.find((s) => s.id === activeSaleId) || matchingSales[0] || null;

  useEffect(() => {
    if (sale) {
      setSelected((prev) => {
        if (Object.keys(prev).length > 0) return prev;
        const all = {};
        sale.items.forEach((_, i) => { all[i] = 1; });
        return all;
      });
    }
  }, [sale]);

  const pickSale = (id) => {
    setActiveSaleId(id);
    setSelected({});
  };

  const toggleItem = (index, maxQty) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[index]) delete next[index];
      else next[index] = 1;
      return next;
    });
  };

  const setQty = (index, qty, maxQty) => {
    const clamped = Math.max(1, Math.min(maxQty, qty));
    setSelected((prev) => ({ ...prev, [index]: clamped }));
  };

  const allSelected = sale && sale.items.length > 0 && sale.items.every((_, i) => selected[i]);
  const toggleAll = () => {
    if (!sale) return;
    if (allSelected) setSelected({});
    else {
      const all = {};
      sale.items.forEach((_, i) => { all[i] = 1; });
      setSelected(all);
    }
  };

  const selectedLines = useMemo(() => {
    if (!sale) return [];
    return Object.entries(selected)
      .filter(([, qty]) => qty > 0)
      .map(([index, qty]) => ({ item: sale.items[Number(index)], qty }));
  }, [sale, selected]);

  const subtotalReturn = selectedLines.reduce((s, l) => s + l.item.price * l.qty, 0);
  const taxAdjustment = -(subtotalReturn * TAX_RATE);
  const refundAmount = Math.max(0, subtotalReturn + taxAdjustment);
  const effectiveMethod = exchange ? 'store_credit' : refundMethod;

  const doProcess = () => {
    if (!sale || selectedLines.length === 0) return;
    const ret = processReturn({
      saleId: sale.id,
      items: selectedLines.map((l) => ({ productId: l.item.productId, name: l.item.name, quantity: l.qty, price: l.item.price })),
      reason,
      refundMethod: effectiveMethod,
      subtotal: subtotalReturn,
      taxAdjustment,
      refundAmount,
      exchange,
    });
    try {
      localStorage.setItem(LAST_RETURN_KEY, JSON.stringify(ret));
    } catch {
      // ignore
    }
    navigate(`${base}/returns/success`, { state: { returnId: ret.id } });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'F2' || e.key === 'F3') {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        doProcess();
      } else if (e.key === 'F5') {
        e.preventDefault();
        setAddCustomerModal(true);
      } else if (e.key === 'Escape') {
        setSelected({});
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="flex h-full flex-col p-4">
      <div className="relative mb-3">
        <svg className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Invoice #, Order ID, Customer name or scan barcode..."
          className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-[14px] placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {search.trim() && (
        <div className="mb-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {matchingSales.slice(0, 5).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => pickSale(s.id)}
              className={cn('flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] hover:bg-blue-50', s.id === sale?.id && 'bg-blue-50')}
            >
              <span className="font-semibold text-gray-900">#{s.id} <span className="font-normal text-gray-500">• {s.customerName}</span></span>
              <span className="font-semibold text-gray-900">{formatCurrency(s.total)}</span>
            </button>
          ))}
          {matchingSales.length === 0 && (
            <p className="px-4 py-3 text-[13px] text-gray-500">No sales found.</p>
          )}
        </div>
      )}

      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setTab('find')}
          className={cn('h-9 rounded-lg px-5 text-[13.5px] font-semibold', tab === 'find' ? 'bg-blue-600 text-white' : 'border border-blue-300 bg-white text-blue-600 hover:bg-blue-50')}
        >
          Find Sale
        </button>
        <button
          type="button"
          onClick={() => setTab('recent')}
          className={cn('h-9 rounded-lg px-5 text-[13.5px] font-semibold', tab === 'recent' ? 'bg-blue-600 text-white' : 'border border-blue-300 bg-white text-blue-600 hover:bg-blue-50')}
        >
          Recent Returns
        </button>
      </div>

      {tab === 'recent' ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-600">
                <th className="px-4 py-2.5 font-medium">Return ID</th>
                <th className="px-4 py-2.5 font-medium">Date</th>
                <th className="px-4 py-2.5 font-medium">Original Sale</th>
                <th className="px-4 py-2.5 text-center font-medium">Items</th>
                <th className="px-4 py-2.5 text-right font-medium">Refund</th>
                <th className="px-4 py-2.5 font-medium">Method</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="px-4 py-2.5 font-semibold text-blue-600">#{r.id}</td>
                  <td className="px-4 py-2.5 text-gray-700">{new Date(r.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td className="px-4 py-2.5 text-gray-800">#{r.saleId}</td>
                  <td className="px-4 py-2.5 text-center">{r.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold">{formatCurrency(r.refundAmount)}</td>
                  <td className="px-4 py-2.5 capitalize">{METHOD_LABELS[r.refundMethod] || r.refundMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {returns.length === 0 && (
            <p className="border-t border-gray-100 py-10 text-center text-sm text-gray-500">No returns processed yet.</p>
          )}
        </div>
      ) : sale ? (
        <div className="grid grid-cols-[minmax(0,1fr)_300px] items-start gap-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="text-[16px] font-bold text-gray-900">Original Sale</h2>
            <p className="mt-0.5 text-[12.5px] text-gray-500">
              Invoice #{sale.id} &nbsp;•&nbsp; {new Date(sale.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} &nbsp;•&nbsp; {sale.customerName} &nbsp;•&nbsp; Paid by <span className="capitalize">{sale.paymentMethod}</span>
            </p>
            <div className="mt-3 space-y-2.5">
              {sale.items.map((item, i) => {
                const p = productById[item.productId];
                const checked = !!selected[i];
                return (
                  <div key={`${item.productId}-${i}`} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleItem(i, item.quantity)}
                      className="h-4.5 w-4.5 h-[18px] w-[18px] shrink-0 accent-blue-600"
                    />
                    <span className="flex h-14 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-[28px]">
                      {CATEGORY_EMOJI[p?.category] || '👕'}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-bold text-gray-900">{item.name}</span>
                      <span className="block text-[11.5px] text-gray-500">SKU: {p?.sku || '—'}</span>
                      <span className="mt-0.5 inline-block rounded bg-green-50 px-1.5 py-0.5 text-[11px] font-semibold text-green-700">Eligible</span>
                    </span>
                    <span className="text-[14px] font-bold text-gray-900">{formatCurrency(item.price)}</span>
                    <span className="text-right">
                      <span className="mb-1 block text-[11.5px] text-gray-600">Return Qty</span>
                      <span className="flex items-center gap-1">
                        <button type="button" disabled={!checked} onClick={() => setQty(i, (selected[i] || 1) - 1, item.quantity)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40">−</button>
                        <span className="min-w-[52px] rounded-md border border-gray-200 px-1 py-1 text-center text-[12px] font-medium">
                          {selected[i] || 0} of {item.quantity}
                        </span>
                        <button type="button" disabled={!checked} onClick={() => setQty(i, (selected[i] || 1) + 1, item.quantity)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40">+</button>
                      </span>
                      <span className="mt-1 block text-[11px] text-gray-500">Qty Sold: {item.quantity}</span>
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-3">
              <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-gray-800">
                <input type="checkbox" checked={!!allSelected} onChange={toggleAll} className="h-[18px] w-[18px] accent-blue-600" />
                Select All
              </label>
              <label className="flex flex-1 items-center gap-2 text-[13px]">
                <span className="font-semibold text-gray-800">Return Reason</span>
                <select value={reason} onChange={(e) => setReason(e.target.value)}
                  className="h-9 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-2.5 text-[12.5px] focus:border-blue-500 focus:outline-none">
                  {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="text-[16px] font-bold text-gray-900">Return / Exchange</h2>
            <div className="mt-2 flex items-center gap-2 text-blue-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="mt-2 text-[13px] font-semibold text-gray-800">Selected Items ({selectedLines.reduce((s, l) => s + l.qty, 0)})</p>
            <div className="mt-1.5 space-y-2">
              {selectedLines.map((l, idx) => {
                const p = productById[l.item.productId];
                return (
                  <div key={idx} className="flex items-center gap-2 text-[12.5px]">
                    <span className="flex h-9 w-8 shrink-0 items-center justify-center rounded bg-gray-50 text-[20px]">
                      {CATEGORY_EMOJI[p?.category] || '👕'}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium text-gray-800">{l.item.name}</span>
                    <span className="text-gray-500">× {l.qty}</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(l.item.price * l.qty)}</span>
                  </div>
                );
              })}
              {selectedLines.length === 0 && (
                <p className="py-2 text-[12.5px] text-gray-500">No items selected.</p>
              )}
            </div>

            <label className="mt-3 flex cursor-pointer items-center justify-between text-[13px] font-medium text-gray-800">
              Exchange for other items
              <button
                type="button"
                role="switch"
                aria-checked={exchange}
                onClick={() => setExchange(!exchange)}
                className={cn('relative h-6 w-11 rounded-full transition-colors', exchange ? 'bg-blue-600' : 'bg-gray-300')}
              >
                <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', exchange ? 'left-[22px]' : 'left-0.5')} />
              </button>
            </label>

            <p className="mb-1.5 mt-3 text-[13px] font-semibold text-gray-800">Refund Method</p>
            <div className={cn('grid grid-cols-3 gap-1 rounded-lg border border-gray-200 p-1', exchange && 'opacity-60')}>
              {REFUND_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  disabled={exchange}
                  onClick={() => setRefundMethod(m.id)}
                  className={cn(
                    'h-8 rounded-md text-[12.5px] font-semibold',
                    effectiveMethod === m.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <dl className="mt-3 space-y-1.5 text-[13px]">
              <div className="flex justify-between"><dt className="text-gray-600">Subtotal Return</dt><dd className="font-medium">{formatCurrency(subtotalReturn)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Restocking Fee</dt><dd className="font-medium">{formatCurrency(0)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Tax Adjustment</dt><dd className="font-medium">{formatCurrency(taxAdjustment)}</dd></div>
            </dl>
            <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
              <span className="text-[14px] font-bold">Refund Amount</span>
              <span className="text-[19px] font-bold text-blue-700">{formatCurrency(refundAmount)}</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => { setSelected({}); setExchange(false); }}
                className="h-10 rounded-lg border border-blue-300 text-[13.5px] font-semibold text-blue-600 hover:bg-blue-50">
                Cancel
              </button>
              <button type="button" onClick={doProcess} disabled={selectedLines.length === 0}
                className="h-10 rounded-lg bg-blue-600 text-[13.5px] font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                Process Return
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-gray-200 bg-white py-10 text-center text-sm text-gray-500">No sale found. Search for a sale above.</p>
      )}

      <AddCustomerModal open={addCustomerModal} onClose={() => setAddCustomerModal(false)} />
    </div>
  );
}
