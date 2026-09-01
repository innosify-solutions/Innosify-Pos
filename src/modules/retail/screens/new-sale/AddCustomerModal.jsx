import { useState } from 'react';
import { Modal, ModalFooter } from '@shared/dialogs/Modal';
import { Input } from '@shared/ui/Input';
import { useCashier } from '../../store';

export function AddCustomerModal({ open, onClose, onCreated }) {
  const { addCustomer } = useCashier();
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    const customer = addCustomer(form);
    onCreated?.(customer);
    setForm({ name: '', phone: '', email: '' });
    setError('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Customer"
      footer={<ModalFooter onCancel={onClose} onConfirm={handleSubmit} confirmLabel="Add Customer" />}
    >
      <div className="space-y-4">
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={error} autoFocus />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
    </Modal>
  );
}
