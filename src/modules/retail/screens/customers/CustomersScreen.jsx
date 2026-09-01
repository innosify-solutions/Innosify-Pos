import { useState } from 'react';
import { SearchField } from '@shared/ui/SearchField';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { EmptyState } from '@shared/feedback/EmptyState';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@shared/tables/Table';
import { Drawer } from '@shared/dialogs/Drawer';
import { Modal, ModalFooter } from '@shared/dialogs/Modal';
import { RetailPage } from '../../layouts/RetailPage';
import { formatCurrency, formatDate } from '../../utils/cashier.utils';
import { useCashier } from '../../store';

export function CustomersScreen() {
  const { customers, addCustomer, updateCustomer } = useCashier();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });

  const filtered = customers.filter(
    (c) =>
      !c.isDefault &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search))
  );

  const openEdit = (customer) => {
    setForm({ name: customer.name, phone: customer.phone, email: customer.email });
    setEditModal(customer.id);
  };

  const handleSave = () => {
    if (editModal && editModal !== true) {
      updateCustomer(editModal, form);
    } else {
      addCustomer(form);
    }
    setEditModal(false);
    setAddModal(false);
    setForm({ name: '', phone: '', email: '' });
  };

  return (
    <RetailPage title="Customers">
      <div className="mb-4 flex items-center gap-4">
        <SearchField
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          className="max-w-md flex-1"
        />
        <Button onClick={() => { setAddModal(true); setForm({ name: '', phone: '', email: '' }); }}>Add Customer</Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No customers found" description="Add a customer to get started." actionLabel="Add Customer" onAction={() => setAddModal(true)} />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Phone</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Loyalty Points</TableHeader>
              <TableHeader>Total Purchases</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((customer) => (
              <TableRow key={customer.id} onClick={() => setSelected(customer)}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.phone || '—'}</TableCell>
                <TableCell>{customer.email || '—'}</TableCell>
                <TableCell>{customer.loyaltyPoints}</TableCell>
                <TableCell>{formatCurrency(customer.totalPurchases)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Customer Details" width="w-[480px]">
        {selected && (
          <div className="p-5">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-content">{selected.name}</h3>
              <p className="text-sm text-content-muted">{selected.phone}</p>
              <p className="text-sm text-content-muted">{selected.email}</p>
              <div className="mt-3 flex gap-4 text-sm">
                <div><span className="text-content-muted">Points:</span> {selected.loyaltyPoints}</div>
                <div><span className="text-content-muted">Total:</span> {formatCurrency(selected.totalPurchases)}</div>
              </div>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => openEdit(selected)}>Edit Customer</Button>
            </div>

            <h4 className="mb-3 text-sm font-semibold text-content">Purchase History</h4>
            {selected.purchaseHistory?.length > 0 ? (
              <div className="space-y-2">
                {selected.purchaseHistory.map((purchase) => (
                  <div key={purchase.id} className="flex justify-between rounded-lg border border-border p-3 text-sm">
                    <div>
                      <p className="font-medium">{formatDate(purchase.date)}</p>
                      <p className="text-xs text-content-muted">{purchase.items} item(s)</p>
                    </div>
                    <span className="font-medium">{formatCurrency(purchase.total)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-content-muted">No purchase history</p>
            )}
          </div>
        )}
      </Drawer>

      <Modal
        open={addModal || !!editModal}
        onClose={() => { setAddModal(false); setEditModal(false); }}
        title={editModal ? 'Edit Customer' : 'Add Customer'}
        footer={<ModalFooter onCancel={() => { setAddModal(false); setEditModal(false); }} onConfirm={handleSave} confirmLabel="Save" />}
      >
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
      </Modal>
    </RetailPage>
  );
}
