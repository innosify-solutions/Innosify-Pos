import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  products as initialProducts,
  customers as initialCustomers,
  initialSales,
  initialHeldSales,
  initialShift,
  initialCashMovements,
} from '../data';
import { calculateCartTotals, generateId } from '../utils/cashier.utils';
import { PAYMENT_METHODS, SALE_STATUS } from '../constants/cashier.constants';
import { posApi } from '@services/api';

const CashierContext = createContext(null);

const defaultCustomer = initialCustomers.find((c) => c.isDefault);

const CART_STORAGE_KEY = 'onepos-active-cart-v1';

function loadPersistedCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.cart)) return null;
    return parsed;
  } catch {
    return null;
  }
}

const persistedCart = typeof localStorage !== 'undefined' ? loadPersistedCart() : null;

export function CashierProvider({ children }) {  const [products, setProducts] = useState(initialProducts);
  const [customers, setCustomers] = useState(initialCustomers);
  const [sales, setSales] = useState(initialSales);
  const [heldSales, setHeldSales] = useState(initialHeldSales);
  const [returns, setReturns] = useState([]);
  const [shift, setShift] = useState(initialShift);
  const [cashMovements, setCashMovements] = useState(initialCashMovements);
  // 'local' = seed data only; 'backend' = hydrated from the Express API.
  const [backendStatus, setBackendStatus] = useState('local');
  const backendRef = useRef(false);
  const shiftRef = useRef(initialShift);

  // Lazy initializer re-reads localStorage on every provider mount —
  // the module-level `persistedCart` can be stale after HMR or remounts.
  const readSavedCart = () => {
    try {
      return loadPersistedCart() || persistedCart;
    } catch {
      return persistedCart;
    }
  };
  const [cart, setCart] = useState(() => readSavedCart()?.cart ?? []);
  const [selectedCustomer, setSelectedCustomer] = useState(() => {
    const saved = readSavedCart();
    return initialCustomers.find((c) => c.id === saved?.customerId) || defaultCustomer;
  });
  const [billDiscount, setBillDiscount] = useState(() => readSavedCart()?.billDiscount ?? 0);

  // Hydrate from the backend when it is reachable. Falls back to local
  // seed data (offline mode) when the API server is not running.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [products, customers, sales, heldSales, returns, cashMovements, shift] = await Promise.all([
          posApi.products.list(),
          posApi.customers.list(),
          posApi.sales.list(),
          posApi.heldSales.list(),
          posApi.returns.list(),
          posApi.cashMovements.list(),
          posApi.shifts.current(),
        ]);
        if (cancelled) return;
        // Validate shapes before committing — a non-API response
        // (e.g. dev-server fallback HTML) must never clobber state.
        if (Array.isArray(products)) setProducts(products);
        if (Array.isArray(customers) && customers.length > 0) {
          setCustomers(customers);
          setSelectedCustomer((prev) =>
            customers.find((c) => c.id === prev?.id) ||
            customers.find((c) => c.isDefault) ||
            customers[0]
          );
        }
        if (Array.isArray(sales)) setSales(sales);
        if (Array.isArray(heldSales)) setHeldSales(heldSales);
        if (Array.isArray(returns)) setReturns(returns);
        if (Array.isArray(cashMovements)) setCashMovements(cashMovements);
        if (shift && typeof shift === 'object' && shift.status) {
          setShift(shift);
          shiftRef.current = shift;
        }
        backendRef.current = true;
        setBackendStatus('backend');
      } catch {
        // Backend unreachable — stay on local seed data.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Fire-and-forget sync: local state is the source of truth for the UI,
  // the backend mirrors it when reachable.
  const sync = useCallback((fn) => {
    if (backendRef.current) {
      fn().catch(() => {
        // Sync failure is non-fatal; the sale data remains valid locally.
      });
    }
  }, []);
  // Persist the active cart so it survives page reloads / direct URL visits
  // (e.g. refreshing on /retail/checkout no longer empties the cart).
  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ cart, billDiscount, customerId: selectedCustomer?.id })
      );
    } catch {
      // storage unavailable — cart simply stays in memory
    }
  }, [cart, billDiscount, selectedCustomer]);

  const cartTotals = useMemo(
    () => calculateCartTotals(cart, billDiscount),
    [cart, billDiscount]
  );

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          discount: 0,
          priceOverride: null,
        },
      ];
    });
  }, []);

  const updateCartItem = useCallback((productId, updates) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, ...updates } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setBillDiscount(0);
    setSelectedCustomer(defaultCustomer);
  }, []);

  const holdSale = useCallback((note = '') => {
    if (cart.length === 0) return null;
    const held = {
      id: generateId('HS'),
      heldAt: new Date().toISOString(),
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      items: [...cart],
      billDiscount,
      note,
      heldBy: shift.openedBy,
    };
    setHeldSales((prev) => [held, ...prev]);
    sync(() => posApi.heldSales.create(held));
    clearCart();
    return held;
  }, [cart, selectedCustomer, billDiscount, clearCart, shift.openedBy, sync]);

  const resumeHeldSale = useCallback((heldId) => {
    const held = heldSales.find((h) => h.id === heldId);
    if (!held) return false;
    setCart(held.items);
    setBillDiscount(held.billDiscount);
    const customer = customers.find((c) => c.id === held.customerId) || defaultCustomer;
    setSelectedCustomer(customer);
    setHeldSales((prev) => prev.filter((h) => h.id !== heldId));
    sync(() => posApi.heldSales.remove(heldId));
    return true;
  }, [heldSales, customers, sync]);

  const deleteHeldSale = useCallback((heldId) => {
    setHeldSales((prev) => prev.filter((h) => h.id !== heldId));
    sync(() => posApi.heldSales.remove(heldId));
  }, [sync]);

  const completeSale = useCallback((paymentDetails) => {
    const tip = Number(paymentDetails.tip) || 0;
    const notes = paymentDetails.notes || '';
    const grandTotal = cartTotals.total + tip;
    const amountReceived = Number(paymentDetails.cashReceived) > 0 ? Number(paymentDetails.cashReceived) : grandTotal;
    const changeDue = Math.max(0, amountReceived - grandTotal);
    const sale = {
      id: generateId('ORD'),
      date: new Date().toISOString(),
      customerId: selectedCustomer?.id || 'c1',
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.priceOverride ?? item.price,
        total: (item.priceOverride ?? item.price) * item.quantity - (item.discount || 0),
      })),
      subtotal: cartTotals.subtotal,
      discount: billDiscount,
      tax: cartTotals.tax,
      tip,
      notes,
      total: grandTotal,
      amountReceived,
      changeDue,
      paymentMethod: paymentDetails.method,
      payments: paymentDetails.payments || [{ method: paymentDetails.method, amount: grandTotal }],
      status: SALE_STATUS.COMPLETED,
      cashier: shift.openedBy,
    };
    setSales((prev) => [sale, ...prev]);
    sync(() => posApi.sales.create(sale));
    clearCart();
    return sale;
  }, [cart, cartTotals, billDiscount, selectedCustomer, shift.openedBy, clearCart, sync]);

  const voidSale = useCallback((saleId) => {
    setSales((prev) =>
      prev.map((s) => (s.id === saleId ? { ...s, status: SALE_STATUS.VOIDED } : s))
    );
    sync(() => posApi.sales.update(saleId, { status: SALE_STATUS.VOIDED }));
  }, [sync]);

  const processReturn = useCallback(({ saleId, items, reason, refundMethod, subtotal, taxAdjustment, refundAmount, exchange }) => {
    const ret = {
      id: generateId('RET'),
      date: new Date().toISOString(),
      saleId,
      items,
      reason,
      refundMethod,
      subtotal,
      taxAdjustment,
      refundAmount,
      exchange: !!exchange,
    };
    setReturns((prev) => [ret, ...prev]);
    sync(() => posApi.returns.create(ret));
    setSales((prev) => {
      const sale = prev.find((s) => s.id === saleId);
      if (!sale) return prev;
      const returnedQty = items.reduce((sum, i) => sum + i.quantity, 0);
      const soldQty = sale.items.reduce((sum, i) => sum + i.quantity, 0);
      const status = returnedQty >= soldQty ? SALE_STATUS.RETURNED : SALE_STATUS.PARTIAL_RETURN;
      return prev.map((s) => (s.id === saleId ? { ...s, status } : s));
    });
    return ret;
  }, [sync]);

  const addCustomer = useCallback((customerData) => {
    const newCustomer = {
      id: generateId('c'),
      ...customerData,
      loyaltyPoints: 0,
      totalPurchases: 0,
      purchaseHistory: [],
    };
    setCustomers((prev) => [...prev, newCustomer]);
    sync(() => posApi.customers.create({ id: newCustomer.id, name: newCustomer.name, phone: newCustomer.phone, email: newCustomer.email }));
    return newCustomer;
  }, [sync]);

  const updateCustomer = useCallback((customerId, updates) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, ...updates } : c))
    );
    sync(() => posApi.customers.update(customerId, updates));
  }, [sync]);

  const addCashMovement = useCallback((movement) => {
    const newMovement = {
      id: generateId('cm'),
      timestamp: new Date().toISOString(),
      performedBy: shift.openedBy,
      ...movement,
    };
    setCashMovements((prev) => [newMovement, ...prev]);
    sync(() => posApi.cashMovements.create(newMovement));
    return newMovement;
  }, [shift.openedBy, sync]);

  const closeShift = useCallback((closingData) => {
    const shiftId = shiftRef.current?.id;
    setShift((prev) => {
      const closed = {
        ...prev,
        status: 'closed',
        closedAt: new Date().toISOString(),
        closingCash: closingData.countedCash,
        variance: closingData.variance,
      };
      shiftRef.current = closed;
      return closed;
    });
    if (shiftId) {
      sync(() => posApi.shifts.close(shiftId, { closingCash: closingData.countedCash, variance: closingData.variance }));
    }
  }, [sync]);

  const value = {
    products,
    customers,
    sales,
    heldSales,
    returns,
    shift,
    cashMovements,
    backendStatus,
    cart,
    cartTotals,
    selectedCustomer,
    billDiscount,
    setSelectedCustomer,
    setBillDiscount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    holdSale,
    resumeHeldSale,
    deleteHeldSale,
    completeSale,
    voidSale,
    processReturn,
    addCustomer,
    updateCustomer,
    addCashMovement,
    closeShift,
    PAYMENT_METHODS,
  };

  return <CashierContext.Provider value={value}>{children}</CashierContext.Provider>;
}

export function useCashier() {
  const context = useContext(CashierContext);
  if (!context) {
    throw new Error('useCashier must be used within CashierProvider');
  }
  return context;
}
