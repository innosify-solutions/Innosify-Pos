import { useState } from 'react';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { Select } from '@shared/ui/Select';
import { Badge } from '@shared/display/Badge';
import { EmptyState } from '@shared/feedback/EmptyState';
import { Modal, ModalFooter } from '@shared/dialogs/Modal';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@shared/tables/Table';
import { RetailPage } from '../../layouts/RetailPage';
import { formatCurrency, formatDate } from '../../utils/cashier.utils';
import { useCashier } from '../../store';

export function CashMovementsScreen() {
  const { cashMovements, addCashMovement } = useCashier();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ type: 'in', amount: '', reason: '' });
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = () => {
    addCashMovement({ type: form.type, amount: Number(form.amount), reason: form.reason });
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setModal(null);
      setForm({ type: 'in', amount: '', reason: '' });
    }, 1500);
  };

  return (
    <RetailPage title="Cash Movements">
      <div className="mb-4 flex gap-3">
        <Button onClick={() => { setModal('in'); setForm({ type: 'in', amount: '', reason: '' }); }}>Cash In</Button>
        <Button variant="outline" onClick={() => { setModal('out'); setForm({ type: 'out', amount: '', reason: '' }); }}>Cash Out</Button>
      </div>

      {cashMovements.length === 0 ? (
        <EmptyState title="No cash movements" description="Cash in/out transactions will appear here." />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Type</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Reason</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>By</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {cashMovements.map((m) => (
              <TableRow key={m.id}>
                <TableCell><Badge variant={m.type === 'in' ? 'success' : 'danger'}>{m.type === 'in' ? 'Cash In' : 'Cash Out'}</Badge></TableCell>
                <TableCell className="font-medium">{formatCurrency(m.amount)}</TableCell>
                <TableCell>{m.reason}</TableCell>
                <TableCell className="text-content-muted">{formatDate(m.timestamp)}</TableCell>
                <TableCell className="text-content-muted">{m.performedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'in' ? 'Cash In' : 'Cash Out'}
        footer={!confirmed && <ModalFooter onCancel={() => setModal(null)} onConfirm={handleSubmit} confirmLabel="Confirm" />}
      >
        {confirmed ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success-muted">
              <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium text-content">Cash {form.type === 'in' ? 'In' : 'Out'} recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Input label="Amount (₹)" type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} autoFocus />
            <Input label="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </div>
        )}
      </Modal>
    </RetailPage>
  );
}
