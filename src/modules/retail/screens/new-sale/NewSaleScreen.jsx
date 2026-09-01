import { useState, useRef, useEffect, useCallback } from 'react';
import { SearchField } from '@shared/ui/SearchField';
import { Button } from '@shared/ui/Button';
import { ConfirmationDialog } from '@shared/dialogs/ConfirmationDialog';
import { ProductCard, CartItem, CartSummary, CategoryFilter } from '../../components/pos';
import { categories } from '../../data/products';
import { filterProducts, findProductByBarcode } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { CustomerSelectModal } from './CustomerSelectModal';
import { AddCustomerModal } from './AddCustomerModal';
import { ItemEditModal } from './ItemEditModal';
import { BillDiscountModal } from './BillDiscountModal';
import { CheckoutModal } from './CheckoutModal';
import { PaymentModal } from './PaymentModal';
import { SaleCompleteModal, ReceiptModal } from './SaleCompleteModal';

export function NewSaleScreen() {
  const {
    products,
    cart,
    cartTotals,
    selectedCustomer,
    billDiscount,
    addToCart,
    updateCartItem,
    removeFromCart,
    holdSale,
  } = useCashier();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [customerModal, setCustomerModal] = useState(false);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [billDiscountModal, setBillDiscountModal] = useState(false);
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const [receiptModal, setReceiptModal] = useState(false);
  const [holdConfirm, setHoldConfirm] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const filteredProducts = filterProducts(products, { search, category: activeCategory });

  const handleBarcodeSearch = useCallback((value) => {
    const product = findProductByBarcode(products, value.trim());
    if (product) {
      addToCart(product);
      setSearch('');
    }
  }, [products, addToCart]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      handleBarcodeSearch(search);
    }
  };

  const handleHoldSale = () => {
    holdSale();
    setHoldConfirm(false);
  };

  const handlePaymentComplete = (sale) => {
    setPaymentModal(false);
    setCheckoutModal(false);
    setCompletedSale(sale);
  };

  return (
    <div className="flex h-full">
      {/* Product Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-border p-4">
          <SearchField
            ref={searchRef}
            placeholder="Scan barcode or search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onClear={() => setSearch('')}
            className="mb-3"
          />
          <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={addToCart} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <p className="py-12 text-center text-sm text-content-muted">No products found</p>
          )}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="flex w-[380px] shrink-0 flex-col border-l border-border bg-surface-elevated">
        <div className="border-b border-border p-4">
          <button
            type="button"
            onClick={() => setCustomerModal(true)}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5 text-left hover:border-accent"
          >
            <div>
              <p className="text-xs text-content-muted">Customer</p>
              <p className="text-sm font-medium text-content">{selectedCustomer?.name || 'Walk-in Customer'}</p>
            </div>
            <svg className="h-4 w-4 text-content-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {cart.length === 0 ? (
            <p className="py-12 text-center text-sm text-content-muted">Cart is empty</p>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onQuantityChange={(id, qty) => updateCartItem(id, { quantity: qty })}
                onRemove={removeFromCart}
                onEdit={setEditItem}
              />
            ))
          )}
        </div>

        <div className="border-t border-border p-4">
          <CartSummary totals={cartTotals} billDiscount={billDiscount} />
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              disabled={cart.length === 0}
              onClick={() => setHoldConfirm(true)}
            >
              Hold
            </Button>
            <Button
              size="lg"
              className="flex-[2]"
              disabled={cart.length === 0}
              onClick={() => setCheckoutModal(true)}
            >
              Checkout
            </Button>
          </div>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={() => setBillDiscountModal(true)}
              className="mt-2 w-full text-center text-xs text-accent hover:underline"
            >
              Apply Bill Discount
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      <CustomerSelectModal
        open={customerModal}
        onClose={() => setCustomerModal(false)}
        onAddNew={() => { setCustomerModal(false); setAddCustomerModal(true); }}
      />
      <AddCustomerModal open={addCustomerModal} onClose={() => setAddCustomerModal(false)} />
      <ItemEditModal
        open={!!editItem}
        item={editItem}
        onClose={() => setEditItem(null)}
        onSave={updateCartItem}
      />
      <BillDiscountModal open={billDiscountModal} onClose={() => setBillDiscountModal(false)} />
      <CheckoutModal
        open={checkoutModal}
        onClose={() => setCheckoutModal(false)}
        onProceed={() => { setCheckoutModal(false); setPaymentModal(true); }}
      />
      <PaymentModal
        open={paymentModal}
        onClose={() => setPaymentModal(false)}
        onComplete={handlePaymentComplete}
      />
      <SaleCompleteModal
        open={!!completedSale && !receiptModal}
        sale={completedSale}
        onReceipt={() => setReceiptModal(true)}
        onNewSale={() => setCompletedSale(null)}
      />
      <ReceiptModal
        open={receiptModal}
        sale={completedSale}
        onClose={() => { setReceiptModal(false); setCompletedSale(null); }}
        onNewSale={() => { setReceiptModal(false); setCompletedSale(null); }}
      />
      <ConfirmationDialog
        open={holdConfirm}
        onClose={() => setHoldConfirm(false)}
        onConfirm={handleHoldSale}
        title="Hold Sale"
        message="This sale will be saved and can be resumed later from Held Sales."
        confirmLabel="Hold Sale"
      />
    </div>
  );
}
