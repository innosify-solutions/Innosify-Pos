import { useState } from 'react';
import { Modal, ModalFooter } from '@shared/dialogs/Modal';
import { Input } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import { PaymentMethodCard } from '../../components/pos/PaymentMethodCard';
import { CartSummary } from '../../components/pos/CartSummary';
import { formatCurrency } from '../../utils/cashier.utils';
import { useCashier } from '../../store';

export function PaymentModal({ open, onClose, onComplete }) {
  const { cartTotals, billDiscount, completeSale, PAYMENT_METHODS } = useCashier();
  const [method, setMethod] = useState(PAYMENT_METHODS.CASH);
  const [splitMode, setSplitMode] = useState(false);
  const [cashAmount, setCashAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');
  const [upiAmount, setUpiAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const total = cartTotals.total;

  const handleComplete = () => {
    setProcessing(true);
    setTimeout(() => {
      let paymentDetails;
      if (splitMode) {
        paymentDetails = {
          method: 'split',
          payments: [
            { method: PAYMENT_METHODS.CASH, amount: Number(cashAmount) || 0 },
            { method: PAYMENT_METHODS.CARD, amount: Number(cardAmount) || 0 },
            { method: PAYMENT_METHODS.UPI, amount: Number(upiAmount) || 0 },
          ].filter((p) => p.amount > 0),
        };
      } else {
        paymentDetails = { method, payments: [{ method, amount: total }] };
      }
      const sale = completeSale(paymentDetails);
      setProcessing(false);
      onComplete(sale);
    }, 500);
  };

  const splitTotal = (Number(cashAmount) || 0) + (Number(cardAmount) || 0) + (Number(upiAmount) || 0);
  const splitValid = Math.abs(splitTotal - total) < 0.01;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Payment"
      size="lg"
      footer={
        <ModalFooter
          onCancel={onClose}
          onConfirm={handleComplete}
          confirmLabel={processing ? 'Processing...' : 'Complete Payment'}
          loading={processing || (splitMode && !splitValid)}
        />
      }
    >
      <div className="mb-6">
        <CartSummary totals={cartTotals} billDiscount={billDiscount} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-content">Payment Method</p>
        <Button variant="ghost" size="sm" onClick={() => setSplitMode(!splitMode)}>
          {splitMode ? 'Single Payment' : 'Split Payment'}
        </Button>
      </div>

      {!splitMode ? (
        <>
          <div className="mb-6 grid grid-cols-3 gap-3">
            <PaymentMethodCard method="cash" label="Cash" selected={method === PAYMENT_METHODS.CASH} onSelect={setMethod} />
            <PaymentMethodCard method="card" label="Card" selected={method === PAYMENT_METHODS.CARD} onSelect={setMethod} />
            <PaymentMethodCard method="upi" label="UPI" selected={method === PAYMENT_METHODS.UPI} onSelect={setMethod} />
          </div>
          {method === PAYMENT_METHODS.CASH && (
            <div className="rounded-lg bg-surface-muted p-4">
              <Input
                label="Cash Received"
                type="number"
                placeholder={total.toFixed(2)}
                onChange={(e) => setCashAmount(e.target.value)}
              />
              {cashAmount && Number(cashAmount) >= total && (
                <p className="mt-2 text-sm text-success">
                  Change: {formatCurrency(Number(cashAmount) - total)}
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <Input label="Cash Amount" type="number" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} />
          <Input label="Card Amount" type="number" value={cardAmount} onChange={(e) => setCardAmount(e.target.value)} />
          <Input label="UPI Amount" type="number" value={upiAmount} onChange={(e) => setUpiAmount(e.target.value)} />
          <p className={`text-sm ${splitValid ? 'text-success' : 'text-danger'}`}>
            Split total: {formatCurrency(splitTotal)} / {formatCurrency(total)}
          </p>
        </div>
      )}
    </Modal>
  );
}
