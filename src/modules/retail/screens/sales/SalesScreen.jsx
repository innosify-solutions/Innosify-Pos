import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchField } from '@shared/ui/SearchField';
import { Button } from '@shared/ui/Button';
import { Badge } from '@shared/display/Badge';
import { EmptyState } from '@shared/feedback/EmptyState';
import { LoadingState } from '@shared/feedback/LoadingState';
import { ConfirmationDialog } from '@shared/dialogs/ConfirmationDialog';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@shared/tables/Table';
import { Drawer } from '@shared/dialogs/Drawer';
import { Tabs } from '@shared/navigation/Tabs';
import { RetailPage } from '../../layouts/RetailPage';
import { ReceiptPreview } from '../../components/pos/ReceiptPreview';
import { formatCurrency, formatDate } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { retailConfig } from '../../config/retail.config';

const dateFilters = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'all', label: 'All' },
];

export function SalesScreen() {
  const { sales, voidSale } = useCashier();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [voidId, setVoidId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const filtered = sales.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const statusVariant = (status) => {
    if (status === 'completed') return 'success';
    if (status === 'voided') return 'danger';
    return 'default';
  };

  return (
    <RetailPage title="Sales">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <SearchField
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          className="max-w-md flex-1"
        />
        <Tabs tabs={dateFilters} activeTab={dateFilter} onChange={setDateFilter} />
      </div>

      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState title="No transactions" description="Completed sales will appear here." />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Transaction</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Customer</TableHeader>
              <TableHeader>Total</TableHeader>
              <TableHeader>Payment</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((sale) => (
              <TableRow key={sale.id} onClick={() => setSelected(sale)}>
                <TableCell className="font-mono text-xs">{sale.id}</TableCell>
                <TableCell className="text-content-muted">{formatDate(sale.date)}</TableCell>
                <TableCell>{sale.customerName}</TableCell>
                <TableCell className="font-medium">{formatCurrency(sale.total)}</TableCell>
                <TableCell className="capitalize">{sale.paymentMethod}</TableCell>
                <TableCell><Badge variant={statusVariant(sale.status)}>{sale.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Drawer open={!!selected && !receiptOpen} onClose={() => setSelected(null)} title="Transaction Details" width="w-[420px]">
        {selected && (
          <div className="p-5">
            <div className="mb-4 space-y-1 text-sm">
              <p><span className="text-content-muted">ID:</span> {selected.id}</p>
              <p><span className="text-content-muted">Date:</span> {formatDate(selected.date)}</p>
              <p><span className="text-content-muted">Customer:</span> {selected.customerName}</p>
              <p><span className="text-content-muted">Cashier:</span> {selected.cashier}</p>
            </div>
            <div className="mb-4 space-y-2 border-b border-border pb-4">
              {selected.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>
            <p className="mb-4 text-lg font-bold">{formatCurrency(selected.total)}</p>
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={() => setReceiptOpen(true)}>Reprint Receipt</Button>
              {selected.status === 'completed' && (
                <>
                  <Button variant="outline" onClick={() => navigate(`${retailConfig.routePrefix}/returns?sale=${selected.id}`)}>
                    Return / Exchange
                  </Button>
                  <Button variant="danger" onClick={() => setVoidId(selected.id)}>Void Transaction</Button>
                </>
              )}
            </div>
          </div>
        )}
      </Drawer>

      <Drawer open={receiptOpen} onClose={() => setReceiptOpen(false)} title="Receipt" width="w-[420px]">
        {selected && <div className="p-5"><ReceiptPreview sale={selected} /></div>}
      </Drawer>

      <ConfirmationDialog
        open={!!voidId}
        onClose={() => setVoidId(null)}
        onConfirm={() => { voidSale(voidId); setVoidId(null); setSelected(null); }}
        title="Void Transaction"
        message="This action cannot be undone. The transaction will be marked as voided."
        confirmLabel="Void"
        variant="danger"
      />
    </RetailPage>
  );
}
