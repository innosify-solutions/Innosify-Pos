import { useState } from 'react';
import { Modal, ModalFooter } from '@shared/dialogs/Modal';
import { SearchField } from '@shared/ui/SearchField';
import { Button } from '@shared/ui/Button';
import { useCashier } from '../../store';

export function CustomerSelectModal({ open, onClose, onAddNew }) {
  const { customers, selectedCustomer, setSelectedCustomer } = useCashier();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      !c.isDefault &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search))
  );

  const handleSelect = (customer) => {
    setSelectedCustomer(customer);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Select Customer"
      size="md"
      footer={
        <div className="flex justify-between">
          <Button variant="outline" onClick={onAddNew}>Add New Customer</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      }
    >
      <SearchField
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
        className="mb-4"
      />
      <div className="max-h-64 space-y-1 overflow-y-auto">
        <button
          type="button"
          onClick={() => handleSelect(customers.find((c) => c.isDefault))}
          className={`w-full rounded-lg px-4 py-3 text-left text-sm transition-colors ${
            selectedCustomer?.isDefault ? 'bg-accent-muted text-accent' : 'hover:bg-surface-muted'
          }`}
        >
          Walk-in Customer
        </button>
        {filtered.map((customer) => (
          <button
            key={customer.id}
            type="button"
            onClick={() => handleSelect(customer)}
            className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
              selectedCustomer?.id === customer.id ? 'bg-accent-muted text-accent' : 'hover:bg-surface-muted'
            }`}
          >
            <p className="text-sm font-medium text-content">{customer.name}</p>
            <p className="text-xs text-content-muted">{customer.phone}</p>
          </button>
        ))}
      </div>
    </Modal>
  );
}
