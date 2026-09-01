import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchField } from '@shared/ui/SearchField';
import { Button } from '@shared/ui/Button';
import { EmptyState } from '@shared/feedback/EmptyState';
import { ConfirmationDialog } from '@shared/dialogs/ConfirmationDialog';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@shared/tables/Table';
import { Drawer } from '@shared/dialogs/Drawer';
import { RetailPage } from '../../layouts/RetailPage';
import { formatCurrency, formatDate, calculateCartTotals } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { retailConfig } from '../../config/retail.config';

export function HeldSalesScreen() {
  const { heldSales, resumeHeldSale, deleteHeldSale } = useCashier();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = heldSales.filter(
    (h) =>
      h.customerName.toLowerCase().includes(search.toLowerCase()) ||
      h.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleResume = (id) => {
    resumeHeldSale(id);
    navigate(`${retailConfig.routePrefix}/new-sale`);
  };

  return (
    <RetailPage title="Held Sales">
      <SearchField
        placeholder="Search held sales..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
        className="mb-4 max-w-md"
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No held sales"
          description="Sales placed on hold will appear here."
          actionLabel="Start New Sale"
          onAction={() => navigate(`${retailConfig.routePrefix}/new-sale`)}
        />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Hold ID</TableHeader>
              <TableHeader>Customer</TableHeader>
              <TableHeader>Items</TableHeader>
              <TableHeader>Total</TableHeader>
              <TableHeader>Held At</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((held) => {
              const totals = calculateCartTotals(held.items, held.billDiscount);
              return (
                <TableRow key={held.id} onClick={() => setSelected(held)}>
                  <TableCell className="font-mono text-xs">{held.id}</TableCell>
                  <TableCell>{held.customerName}</TableCell>
                  <TableCell>{held.items.length}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(totals.total)}</TableCell>
                  <TableCell className="text-content-muted">{formatDate(held.heldAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" onClick={() => handleResume(held.id)}>Resume</Button>
                      <Button size="sm" variant="danger" onClick={() => setDeleteId(held.id)}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Held Sale Details" width="w-[420px]">
        {selected && (
          <div className="p-5">
            <div className="mb-4 space-y-1 text-sm">
              <p><span className="text-content-muted">ID:</span> {selected.id}</p>
              <p><span className="text-content-muted">Customer:</span> {selected.customerName}</p>
              <p><span className="text-content-muted">Held:</span> {formatDate(selected.heldAt)}</p>
              {selected.note && <p><span className="text-content-muted">Note:</span> {selected.note}</p>}
            </div>
            <div className="mb-4 space-y-2">
              {selected.items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatCurrency((item.priceOverride ?? item.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={() => handleResume(selected.id)}>Resume Sale</Button>
          </div>
        )}
      </Drawer>

      <ConfirmationDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteHeldSale(deleteId); setDeleteId(null); }}
        title="Delete Held Sale"
        message="This held sale will be permanently removed."
        confirmLabel="Delete"
        variant="danger"
      />
    </RetailPage>
  );
}
