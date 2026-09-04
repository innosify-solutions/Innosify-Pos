import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui/Button';
import { ConfirmationDialog } from '@shared/dialogs/ConfirmationDialog';
import { ProductCard, CartItem, CartSummary, CategoryFilter } from '../../components/pos';
import { categories } from '../../data/products';
import { filterProducts, findProductByBarcode, formatCurrency } from '../../utils/cashier.utils';
import { useCashier } from '../../store';
import { CustomerSelectModal } from './CustomerSelectModal';
import { AddCustomerModal } from './AddCustomerModal';
import { ItemEditModal } from './ItemEditModal';
import { BillDiscountModal } from './BillDiscountModal';

function EmptyCartArt() {
  return (
    <svg viewBox="0 0 120 90" className="mx-auto h-[110px] w-[140px] text-blue-200" fill="none">
      <path d="M18 22h10l9 38h44l9-28H34" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="42" cy="72" r="6" fill="currentColor" opacity="0.9" />
      <circle cx="74" cy="72" r="6" fill="currentColor" opacity="0.9" />
      <path d="M88 12l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" fill="currentColor" opacity="0.7" />
      <path d="M102 26l1.4 3.2 3.2 1.4-3.2 1.4-1.4 3.2-1.4-3.2-3.2-1.4 3.2-1.4 1.4-3.2z" fill="currentColor" opacity="0.5" />
      <path d="M14 52l1.2 2.8 2.8 1.2-2.8 1.2L14 60l-1.2-2.8L10 56l2.8-1.2L14 52z" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function NewSaleScreen() {
  const navigate = useNavigate();
  const {
    products,
    cart,
    cartTotals,
    selectedCustomer,
    billDiscount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    holdSale,
  } = useCashier();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [customerModal, setCustomerModal] = useState(false);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [billDiscountModal, setBillDiscountModal] = useState(false);
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

  const goToCheckout = () => {
    if (cart.length > 0) navigate('/retail/checkout');
  };

  // Keyboard shortcuts matching bottom bar: F2 search, F3 hold, F4 checkout, Esc clear
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'F3') {
        e.preventDefault();
        if (cart.length > 0) setHoldConfirm(true);
      } else if (e.key === 'F4') {
        e.preventDefault();
        goToCheckout();
      } else if (e.key === 'Escape') {
        if (!editItem && cart.length > 0) clearCart();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cart.length, editItem, clearCart]);

  return (
    <div className="flex h-full bg-[#f7f8fa]">
      {/* Center: product area */}
      <div className="flex min-w-0 flex-1 flex-col px-4 pb-3 pt-3">
        <h1 className="mb-2 text-[24px] font-bold tracking-tight text-gray-900">New Sale</h1>
        <div className="relative mb-2.5">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Scan barcode or search product..."
            className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-[14px] text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
        <div className="mt-2 min-h-0 flex-1 overflow-y-auto pr-0.5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={addToCart} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <p className="py-12 text-center text-sm text-gray-500">No products found</p>
          )}
        </div>
      </div>

      {/* Right: cart panel */}
      <div className="flex w-[300px] shrink-0 flex-col border-l border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-3">
          <button
            type="button"
            onClick={() => setCustomerModal(true)}
            className="flex w-full items-center gap-2 text-left"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-gray-50">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <span className="flex-1 truncate text-[14px] font-semibold text-gray-900">
              {selectedCustomer?.name || 'Walk-in Customer'}
            </span>
            <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center px-2 pb-4 pt-10 text-center">
              <EmptyCartArt />
              <p className="mt-3 text-[16px] font-bold text-gray-900">Your cart is empty</p>
              <p className="mt-1 text-[13px] text-gray-500">Add products to get started.</p>
            </div>
          ) : (
            <div className="py-1">
              {cart.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onQuantityChange={(id, qty) => updateCartItem(id, { quantity: qty })}
                  onRemove={removeFromCart}
                  onEdit={setEditItem}
                />
              ))}
              <button
                type="button"
                onClick={() => setBillDiscountModal(true)}
                className="mt-1 w-full text-center text-xs font-medium text-blue-600 hover:underline"
              >
                {billDiscount > 0 ? `Bill discount: ${formatCurrency(billDiscount)} (edit)` : 'Apply Bill Discount'}
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-4 py-3">
          <CartSummary totals={cartTotals} billDiscount={billDiscount} />
          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              className="h-11 flex-1 rounded-lg border-gray-300 text-[14px] font-semibold"
              disabled={cart.length === 0}
              onClick={() => setHoldConfirm(true)}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Hold
            </Button>
            <Button
              className="h-11 flex-[1.4] rounded-lg bg-blue-600 text-[14px] font-semibold hover:bg-blue-700"
              disabled={cart.length === 0}
              onClick={goToCheckout}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Checkout
            </Button>
          </div>
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
