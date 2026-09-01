import { Modal, ModalFooter } from '@shared/dialogs/Modal';
import { CartSummary } from '../../components/pos/CartSummary';
import { useCashier } from '../../store';

export function CheckoutModal({ open, onClose, onProceed }) {
  const { cart, cartTotals, selectedCustomer, billDiscount } = useCashier();

  if (cart.length === 0) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Review Order"
      size="md"
      footer={<ModalFooter onCancel={onClose} onConfirm={onProceed} confirmLabel="Proceed to Payment" />}
    >
      <div className="mb-4">
        <p className="text-sm text-content-muted">Customer</p>
        <p className="font-medium text-content">{selectedCustomer?.name || 'Walk-in Customer'}</p>
      </div>
      <div className="mb-4 max-h-48 space-y-2 overflow-y-auto">
        {cart.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm">
            <span>{item.name} x{item.quantity}</span>
            <span>₹{((item.priceOverride ?? item.price) * item.quantity - (item.discount || 0)).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <CartSummary totals={cartTotals} billDiscount={billDiscount} />
    </Modal>
  );
}
