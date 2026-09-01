import { useState } from 'react';
import { Modal, ModalFooter } from '@shared/dialogs/Modal';
import { Input } from '@shared/ui/Input';
import { useCashier } from '../../store';

export function BillDiscountModal({ open, onClose }) {
  const { billDiscount, setBillDiscount } = useCashier();
  const [value, setValue] = useState(billDiscount);

  const handleApply = () => {
    setBillDiscount(Number(value) || 0);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Bill Discount"
      size="sm"
      footer={<ModalFooter onCancel={onClose} onConfirm={handleApply} confirmLabel="Apply" />}
    >
      <Input
        label="Discount Amount (₹)"
        type="number"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
    </Modal>
  );
}
