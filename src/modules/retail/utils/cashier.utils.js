import { TAX_RATE } from '../constants/cashier.constants.js';

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount ?? 0);
}

export function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString));
}

export function formatDateShort(dateString) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(dateString));
}

export function generateId(prefix) {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

export function calculateCartTotals(items, billDiscount = 0) {
  const subtotal = items.reduce((sum, item) => {
    const price = item.priceOverride ?? item.price;
    const lineTotal = price * item.quantity - (item.discount || 0);
    return sum + lineTotal;
  }, 0);

  const discountedSubtotal = Math.max(0, subtotal - billDiscount);
  const tax = discountedSubtotal * TAX_RATE;
  const total = discountedSubtotal + tax;

  return { subtotal, billDiscount, tax, total, itemCount: items.reduce((s, i) => s + i.quantity, 0) };
}

export function findProductByBarcode(products, barcode) {
  return products.find((p) => p.barcode === barcode || p.sku === barcode);
}

export function filterProducts(products, { search = '', category = 'all' }) {
  const q = search.toLowerCase().trim();
  return products.filter((p) => {
    const matchesCategory = category === 'all' || p.category === category;
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.barcode.includes(q);
    return matchesCategory && matchesSearch;
  });
}
