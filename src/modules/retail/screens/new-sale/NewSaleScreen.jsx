import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <svg viewBox="0 0 120 90" className="mx-auto h-[110px] w-[140px] text-green-500" fill="none">
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
    setBillDiscount,
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
    <div className="flex h-full gap-3">
      {/* Center: product area */}
      <div className="flex min-w-0 flex-1 flex-col pb-1 pt-1">
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
            className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-12 text-[14px] text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
          </button>
        </div>
        <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
        <div className="thin-scroll mt-2 min-h-0 flex-1 overflow-y-auto pr-0.5">
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

      {/* Right: cart card — pure white, rounded on all four corners */}
      <div className="flex w-[360px] shrink-0 flex-col overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCustomerModal(true)}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left hover:bg-gray-100"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <span className="flex-1 truncate text-[14px] font-semibold text-gray-900">
                {selectedCustomer?.name || 'Walk-in Customer'}
              </span>
              <svg className="h-4 w-4 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={clearCart}
              disabled={cart.length === 0}
              className="shrink-0 self-stretch rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-100 disabled:opacity-40"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {cart.length > 0 && (
            <p className="pt-2 text-[13px] font-semibold text-gray-700">
              Items ({cartTotals.itemCount})
            </p>
          )}
          {cart.length === 0 ? (
            <div className="flex min-h-full flex-col items-center justify-center px-2 py-6 text-center">
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
            </div>
          )}
        </div>

        <div className="px-4 py-4">
          {billDiscount > 0 ? (
            <div className="mb-3 flex items-center justify-between rounded-lg bg-green-50 px-3 py-2">
              <span className="text-[13px] font-semibold text-green-700">
                Discount applied: −{formatCurrency(billDiscount)}
              </span>
              <button
                type="button"
                onClick={() => setBillDiscount(0)}
                className="text-[12.5px] font-semibold text-green-700 underline hover:text-green-900"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => setBillDiscountModal(true)}
              className="mb-3 flex items-center gap-1.5 text-[13px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline disabled:opacity-40 disabled:no-underline"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Apply Discount
            </button>
          )}
          <CartSummary totals={cartTotals} billDiscount={billDiscount} />
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => setHoldConfirm(true)}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white text-[14px] font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Hold
            </button>
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={goToCheckout}
              className="flex h-12 flex-[1.3] items-center justify-center gap-2 rounded-xl bg-[#1a5c3a] text-[14px] font-semibold text-white hover:bg-[#15502f] disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Checkout
            </button>
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
