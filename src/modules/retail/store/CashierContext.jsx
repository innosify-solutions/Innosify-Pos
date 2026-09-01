import { createContext, useContext, useState, useCallback, useMemo } from 'react';
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

const CashierContext = createContext(null);

const defaultCustomer = initialCustomers.find((c) => c.isDefault);

export function CashierProvider({ children }) {
  const [products] = useState(initialProducts);
  const [customers, setCustomers] = useState(initialCustomers);
  const [sales, setSales] = useState(initialSales);
  const [heldSales, setHeldSales] = useState(initialHeldSales);
  const [shift, setShift] = useState(initialShift);
  const [cashMovements, setCashMovements] = useState(initialCashMovements);

  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(defaultCustomer);
  const [billDiscount, setBillDiscount] = useState(0);

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
      id: generateId('HOLD'),
      heldAt: new Date().toISOString(),
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      items: [...cart],
      billDiscount,
      note,
    };
    setHeldSales((prev) => [held, ...prev]);
    clearCart();
    return held;
  }, [cart, selectedCustomer, billDiscount, clearCart]);

  const resumeHeldSale = useCallback((heldId) => {
    const held = heldSales.find((h) => h.id === heldId);
    if (!held) return false;
    setCart(held.items);
    setBillDiscount(held.billDiscount);
    const customer = customers.find((c) => c.id === held.customerId) || defaultCustomer;
    setSelectedCustomer(customer);
    setHeldSales((prev) => prev.filter((h) => h.id !== heldId));
    return true;
  }, [heldSales, customers]);

  const deleteHeldSale = useCallback((heldId) => {
    setHeldSales((prev) => prev.filter((h) => h.id !== heldId));
  }, []);

  const completeSale = useCallback((paymentDetails) => {
    const sale = {
      id: generateId('TXN'),
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
      total: cartTotals.total,
      paymentMethod: paymentDetails.method,
      payments: paymentDetails.payments || [{ method: paymentDetails.method, amount: cartTotals.total }],
      status: SALE_STATUS.COMPLETED,
      cashier: shift.openedBy,
    };
    setSales((prev) => [sale, ...prev]);
    clearCart();
    return sale;
  }, [cart, cartTotals, billDiscount, selectedCustomer, shift.openedBy, clearCart]);

  const voidSale = useCallback((saleId) => {
    setSales((prev) =>
      prev.map((s) => (s.id === saleId ? { ...s, status: SALE_STATUS.VOIDED } : s))
    );
  }, []);

  const addCustomer = useCallback((customerData) => {
    const newCustomer = {
      id: generateId('c'),
      ...customerData,
      loyaltyPoints: 0,
      totalPurchases: 0,
      purchaseHistory: [],
    };
    setCustomers((prev) => [...prev, newCustomer]);
    return newCustomer;
  }, []);

  const updateCustomer = useCallback((customerId, updates) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, ...updates } : c))
    );
  }, []);

  const addCashMovement = useCallback((movement) => {
    const newMovement = {
      id: generateId('cm'),
      timestamp: new Date().toISOString(),
      performedBy: shift.openedBy,
      ...movement,
    };
    setCashMovements((prev) => [newMovement, ...prev]);
    return newMovement;
  }, [shift.openedBy]);

  const closeShift = useCallback((closingData) => {
    setShift((prev) => ({
      ...prev,
      status: 'closed',
      closedAt: new Date().toISOString(),
      closingCash: closingData.countedCash,
      variance: closingData.variance,
    }));
  }, []);

  const value = {
    products,
    customers,
    sales,
    heldSales,
    shift,
    cashMovements,
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
