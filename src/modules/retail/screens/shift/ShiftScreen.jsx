import { useState } from 'react';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { Badge } from '@shared/display/Badge';
import { Modal, ModalFooter } from '@shared/dialogs/Modal';
import { RetailPage } from '../../layouts/RetailPage';
import { formatCurrency, formatDate } from '../../utils/cashier.utils';
import { useCashier } from '../../store';

export function ShiftScreen() {
  const { shift, cashMovements, closeShift } = useCashier();
  const [closeModal, setCloseModal] = useState(false);
  const [countedCash, setCountedCash] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const cashIn = cashMovements.filter((m) => m.type === 'in').reduce((s, m) => s + m.amount, 0);
  const cashOut = cashMovements.filter((m) => m.type === 'out').reduce((s, m) => s + m.amount, 0);
  const expectedCash = shift.openingCash + shift.paymentSummary.cash + cashIn - cashOut;
  const variance = countedCash ? Number(countedCash) - expectedCash : 0;

  const handleClose = () => {
    closeShift({ countedCash: Number(countedCash), variance });
    setConfirmed(true);
    setCloseModal(false);
  };

  if (confirmed || shift.status === 'closed') {
    return (
      <RetailPage title="Current Shift">
        <div className="flex flex-col items-center py-16 text-center">
          <Badge variant="default" className="mb-4">Shift Closed</Badge>
          <p className="text-content-muted">Shift closed at {formatDate(shift.closedAt || new Date().toISOString())}</p>
          {shift.variance != null && (
            <p className={`mt-2 text-lg font-semibold ${shift.variance === 0 ? 'text-success' : 'text-danger'}`}>
              Variance: {formatCurrency(shift.variance)}
            </p>
          )}
        </div>
      </RetailPage>
    );
  }

  return (
    <RetailPage title="Current Shift">
      <div className="mb-6 flex items-center gap-3">
        <Badge variant="success">Open</Badge>
        <span className="text-sm text-content-muted">Opened {formatDate(shift.openedAt)} by {shift.openedBy}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border p-5">
          <p className="text-sm text-content-muted">Opening Cash</p>
          <p className="mt-1 text-2xl font-bold text-content">{formatCurrency(shift.openingCash)}</p>
        </div>
        <div className="rounded-lg border border-border p-5">
          <p className="text-sm text-content-muted">Total Sales</p>
          <p className="mt-1 text-2xl font-bold text-content">{shift.salesSummary.totalSales}</p>
          <p className="text-sm text-content-muted">{formatCurrency(shift.salesSummary.totalRevenue)} revenue</p>
        </div>
        <div className="rounded-lg border border-border p-5">
          <p className="text-sm text-content-muted">Expected Cash</p>
          <p className="mt-1 text-2xl font-bold text-content">{formatCurrency(expectedCash)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border p-5">
        <h3 className="mb-4 text-sm font-semibold text-content">Payment Summary</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex justify-between rounded bg-surface-muted px-4 py-3 text-sm">
            <span>Cash</span><span className="font-medium">{formatCurrency(shift.paymentSummary.cash)}</span>
          </div>
          <div className="flex justify-between rounded bg-surface-muted px-4 py-3 text-sm">
            <span>Card</span><span className="font-medium">{formatCurrency(shift.paymentSummary.card)}</span>
          </div>
          <div className="flex justify-between rounded bg-surface-muted px-4 py-3 text-sm">
            <span>UPI</span><span className="font-medium">{formatCurrency(shift.paymentSummary.upi)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button variant="danger" size="lg" onClick={() => setCloseModal(true)}>Close Register</Button>
      </div>

      <Modal
        open={closeModal}
        onClose={() => setCloseModal(false)}
        title="Close Register"
        footer={<ModalFooter onCancel={() => setCloseModal(false)} onConfirm={handleClose} confirmLabel="Close Shift" confirmVariant="danger" />}
      >
        <div className="space-y-4">
          <p className="text-sm text-content-muted">Expected cash in drawer: <strong>{formatCurrency(expectedCash)}</strong></p>
          <Input
            label="Counted Cash"
            type="number"
            value={countedCash}
            onChange={(e) => setCountedCash(e.target.value)}
            autoFocus
          />
          {countedCash && (
            <p className={`text-sm font-medium ${variance === 0 ? 'text-success' : variance > 0 ? 'text-warning' : 'text-danger'}`}>
              Variance: {formatCurrency(variance)} {variance > 0 ? '(over)' : variance < 0 ? '(short)' : '(balanced)'}
            </p>
          )}
        </div>
      </Modal>
    </RetailPage>
  );
}
