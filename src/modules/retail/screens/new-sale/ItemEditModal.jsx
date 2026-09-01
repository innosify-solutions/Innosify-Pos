import { useState } from 'react';
import { Modal, ModalFooter } from '@shared/dialogs/Modal';
import { Input } from '@shared/ui/Input';

export function ItemEditModal({ open, onClose, item, onSave }) {
  const [discount, setDiscount] = useState(item?.discount || 0);
  const [priceOverride, setPriceOverride] = useState(item?.priceOverride ?? '');

  if (!item) return null;

  const handleSave = () => {
    onSave(item.productId, {
      discount: Number(discount) || 0,
      priceOverride: priceOverride === '' ? null : Number(priceOverride),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit: ${item.name}`}
      size="sm"
      footer={<ModalFooter onCancel={onClose} onConfirm={handleSave} confirmLabel="Apply" />}
    >
      <div className="space-y-4">
        <p className="text-sm text-content-muted">Original price: ₹{item.price}</p>
        <Input
          label="Item Discount (₹)"
          type="number"
          min="0"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
        <Input
          label="Price Override (₹)"
          type="number"
          min="0"
          placeholder="Leave empty for original price"
          value={priceOverride}
          onChange={(e) => setPriceOverride(e.target.value)}
        />
      </div>
    </Modal>
  );
}
