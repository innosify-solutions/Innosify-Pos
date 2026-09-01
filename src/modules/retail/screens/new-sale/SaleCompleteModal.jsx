import { Modal, ModalFooter } from '@shared/dialogs/Modal';
import { ReceiptPreview } from '../../components/pos/ReceiptPreview';
import { formatCurrency } from '../../utils/cashier.utils';

export function SaleCompleteModal({ open, sale, onReceipt, onNewSale }) {
  if (!sale) return null;

  return (
    <Modal
      open={open}
      onClose={onNewSale}
      title="Sale Completed"
      size="sm"
      footer={
        <div className="flex gap-3">
          <ModalFooter onCancel={onReceipt} cancelLabel="View Receipt" onConfirm={onNewSale} confirmLabel="New Sale" />
        </div>
      }
    >
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-muted">
          <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-2xl font-bold text-content">{formatCurrency(sale.total)}</p>
        <p className="mt-1 text-sm text-content-muted">Transaction {sale.id}</p>
        <p className="mt-1 text-sm capitalize text-content-muted">Paid via {sale.paymentMethod}</p>
      </div>
    </Modal>
  );
}

export function ReceiptModal({ open, sale, onClose, onNewSale }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Receipt"
      size="md"
      footer={
        <div className="flex justify-between">
          <ModalFooter onCancel={onClose} cancelLabel="Close" />
          <ModalFooter onConfirm={onNewSale} confirmLabel="New Sale" />
        </div>
      }
    >
      <ReceiptPreview sale={sale} />
      <div className="mt-4 flex justify-center gap-3">
        <button type="button" className="text-sm text-accent hover:underline">Print Receipt</button>
        <button type="button" className="text-sm text-accent hover:underline">Email Receipt</button>
      </div>
    </Modal>
  );
}
