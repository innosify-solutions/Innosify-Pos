import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchField } from '@shared/ui/SearchField';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { Select } from '@shared/ui/Select';
import { RetailPage } from '../../layouts/RetailPage';
import { formatCurrency } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { RETURN_TYPES, REFUND_METHODS } from '../../constants/cashier.constants';

const STEPS = ['find', 'select', 'quantity', 'action', 'refund', 'confirm'];

export function ReturnsScreen() {
  const { sales } = useCashier();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState('find');
  const [search, setSearch] = useState(searchParams.get('sale') || '');
  const [foundSale, setFoundSale] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [returnType, setReturnType] = useState(RETURN_TYPES.RETURN);
  const [refundMethod, setRefundMethod] = useState(REFUND_METHODS.CASH);
  const [confirmed, setConfirmed] = useState(false);

  const handleFind = () => {
    const sale = sales.find(
      (s) => s.id.toLowerCase() === search.toLowerCase() && s.status === 'completed'
    );
    if (sale) {
      setFoundSale(sale);
      setStep('select');
    }
  };

  const toggleItem = (index) => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      if (next[index]) delete next[index];
      else next[index] = { quantity: 1, max: foundSale.items[index].quantity };
      return next;
    });
  };

  const selectedCount = Object.keys(selectedItems).length;
  const refundTotal = Object.entries(selectedItems).reduce((sum, [idx, sel]) => {
    const item = foundSale?.items[Number(idx)];
    return sum + (item ? (item.total / item.quantity) * sel.quantity : 0);
  }, 0);

  if (confirmed) {
    return (
      <RetailPage title="Returns & Exchanges">
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-muted">
            <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-content">
            {returnType === RETURN_TYPES.RETURN ? 'Return' : 'Exchange'} Processed
          </h2>
          <p className="mt-1 text-content-muted">Refund: {formatCurrency(refundTotal)} via {refundMethod.replace('_', ' ')}</p>
          <Button className="mt-6" onClick={() => { setConfirmed(false); setStep('find'); setFoundSale(null); setSelectedItems({}); setSearch(''); }}>
            Process Another
          </Button>
        </div>
      </RetailPage>
    );
  }

  return (
    <RetailPage title="Returns & Exchanges">
      {/* Step indicator */}
      <div className="mb-6 flex gap-2">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded ${STEPS.indexOf(step) >= i ? 'bg-accent' : 'bg-border'}`}
          />
        ))}
      </div>

      {step === 'find' && (
        <div className="mx-auto max-w-md">
          <h2 className="mb-4 text-base font-medium text-content">Find Original Sale</h2>
          <SearchField
            placeholder="Enter transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFind()}
            className="mb-4"
          />
          <Button onClick={handleFind} disabled={!search.trim()}>Find Sale</Button>
        </div>
      )}

      {step === 'select' && foundSale && (
        <div className="mx-auto max-w-lg">
          <h2 className="mb-2 text-base font-medium text-content">Select Items to Return</h2>
          <p className="mb-4 text-sm text-content-muted">Sale {foundSale.id} — {foundSale.customerName}</p>
          <div className="mb-4 space-y-2">
            {foundSale.items.map((item, i) => (
              <label key={i} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${selectedItems[i] ? 'border-accent bg-accent-muted' : 'border-border'}`}>
                <input type="checkbox" checked={!!selectedItems[i]} onChange={() => toggleItem(i)} className="h-4 w-4" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-content-muted">Qty: {item.quantity} — {formatCurrency(item.total)}</p>
                </div>
              </label>
            ))}
          </div>
          <Button onClick={() => setStep('quantity')} disabled={selectedCount === 0}>Continue</Button>
        </div>
      )}

      {step === 'quantity' && foundSale && (
        <div className="mx-auto max-w-lg">
          <h2 className="mb-4 text-base font-medium text-content">Select Quantity</h2>
          {Object.entries(selectedItems).map(([idx, sel]) => {
            const item = foundSale.items[Number(idx)];
            return (
              <div key={idx} className="mb-3 flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm">{item.name}</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setSelectedItems((p) => ({ ...p, [idx]: { ...sel, quantity: Math.max(1, sel.quantity - 1) } }))} className="h-8 w-8 rounded border">−</button>
                  <span className="w-8 text-center">{sel.quantity}</span>
                  <button type="button" onClick={() => setSelectedItems((p) => ({ ...p, [idx]: { ...sel, quantity: Math.min(sel.max, sel.quantity + 1) } }))} className="h-8 w-8 rounded border">+</button>
                </div>
              </div>
            );
          })}
          <Button onClick={() => setStep('action')}>Continue</Button>
        </div>
      )}

      {step === 'action' && (
        <div className="mx-auto max-w-md">
          <h2 className="mb-4 text-base font-medium text-content">Return or Exchange?</h2>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setReturnType(RETURN_TYPES.RETURN)} className={`rounded-lg border-2 p-4 text-sm font-medium ${returnType === RETURN_TYPES.RETURN ? 'border-accent bg-accent-muted text-accent' : 'border-border'}`}>Return</button>
            <button type="button" onClick={() => setReturnType(RETURN_TYPES.EXCHANGE)} className={`rounded-lg border-2 p-4 text-sm font-medium ${returnType === RETURN_TYPES.EXCHANGE ? 'border-accent bg-accent-muted text-accent' : 'border-border'}`}>Exchange</button>
          </div>
          <p className="mb-4 text-sm text-content-muted">Refund amount: {formatCurrency(refundTotal)}</p>
          <Button onClick={() => setStep('refund')}>Continue</Button>
        </div>
      )}

      {step === 'refund' && (
        <div className="mx-auto max-w-md">
          <h2 className="mb-4 text-base font-medium text-content">Refund Method</h2>
          <Select value={refundMethod} onChange={(e) => setRefundMethod(e.target.value)} className="mb-4">
            <option value={REFUND_METHODS.CASH}>Cash</option>
            <option value={REFUND_METHODS.CARD}>Card</option>
            <option value={REFUND_METHODS.STORE_CREDIT}>Store Credit</option>
          </Select>
          <Button onClick={() => setStep('confirm')}>Review</Button>
        </div>
      )}

      {step === 'confirm' && (
        <div className="mx-auto max-w-md text-center">
          <h2 className="mb-4 text-base font-medium text-content">Confirm {returnType === RETURN_TYPES.RETURN ? 'Return' : 'Exchange'}</h2>
          <p className="mb-2 text-2xl font-bold">{formatCurrency(refundTotal)}</p>
          <p className="mb-6 text-sm text-content-muted">Refund via {refundMethod.replace('_', ' ')}</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setStep('refund')}>Back</Button>
            <Button onClick={() => setConfirmed(true)}>Confirm</Button>
          </div>
        </div>
      )}
    </RetailPage>
  );
}
