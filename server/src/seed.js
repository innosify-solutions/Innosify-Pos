/**
 * Seed data — mirrors the frontend demo catalog (Takshi sarees).
 * Only inserted into empty tables on first boot.
 */
const products = [
  { id: 's1', name: 'Banarasi Silk Saree — Royal Red', sku: '300001', barcode: '300001', price: 5499, category: 'banarasi', stock: 5 },
  { id: 's2', name: 'Kanjivaram Silk Saree — Temple Green', sku: '300002', barcode: '300002', price: 7999, category: 'kanjivaram', stock: 12 },
  { id: 's3', name: 'Chanderi Cotton Saree — Sky Blue', sku: '300003', barcode: '300003', price: 1899, category: 'cotton', stock: 40 },
  { id: 's4', name: 'Chiffon Saree — Blush Pink', sku: '300004', barcode: '300004', price: 1499, category: 'chiffon', stock: 60 },
  { id: 's5', name: 'Georgette Saree — Wine Maroon', sku: '300005', barcode: '300005', price: 2299, category: 'georgette', stock: 35 },
  { id: 's6', name: 'Tussar Silk Saree — Golden Beige', sku: '300006', barcode: '300006', price: 3999, category: 'silk', stock: 8 },
  { id: 's7', name: 'Linen Saree — Ivory White', sku: '300007', barcode: '300007', price: 2599, category: 'linen', stock: 25 },
  { id: 's8', name: 'Bandhani Saree — Festive Orange', sku: '300008', barcode: '300008', price: 2799, category: 'cotton', stock: 30 },
  { id: 's9', name: 'Mysore Silk Saree — Royal Purple', sku: '300009', barcode: '300009', price: 6499, category: 'silk', stock: 10 },
  { id: 's10', name: 'Organza Saree — Pastel Mint', sku: '300010', barcode: '300010', price: 3199, category: 'chiffon', stock: 22 },
  { id: 's11', name: 'Ajrakh Cotton Saree — Indigo', sku: '300011', barcode: '300011', price: 1999, category: 'cotton', stock: 45 },
  { id: 's12', name: 'Patola Silk Saree — Multicolor', sku: '300012', barcode: '300012', price: 8999, category: 'silk', stock: 4 },
  { id: 's13', name: 'Crepe Saree — Charcoal Black', sku: '300013', barcode: '300013', price: 1799, category: 'georgette', stock: 50 },
  { id: 's14', name: 'Maheshwari Saree — Turquoise', sku: '300014', barcode: '300014', price: 2499, category: 'cotton', stock: 28 },
  { id: 's15', name: 'Net Embroidered Saree — Bridal Red', sku: '300015', barcode: '300015', price: 5999, category: 'banarasi', stock: 7 },
];

const customers = [
  { id: 'c1', name: 'Walk-in Customer', phone: '', email: '', isDefault: true, loyaltyPoints: 0, totalPurchases: 0, purchaseHistory: [] },
  { id: 'c2', name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@email.com', loyaltyPoints: 450, totalPurchases: 12500 },
  { id: 'c3', name: 'Priya Sharma', phone: '+91 87654 32109', email: 'priya@email.com', loyaltyPoints: 820, totalPurchases: 24800 },
  { id: 'c4', name: 'Amit Patel', phone: '+91 76543 21098', email: 'amit@email.com', loyaltyPoints: 120, totalPurchases: 3200 },
];

const sales = [
  {
    id: 'ORD-100245', date: '2026-09-02T14:45:00', customerId: 'c1', customerName: 'Walk-in Customer',
    items: [
      { productId: 's1', name: 'Banarasi Silk Saree — Royal Red', quantity: 1, price: 5499, total: 5499 },
      { productId: 's5', name: 'Georgette Saree — Wine Maroon', quantity: 1, price: 2299, total: 2299 },
    ],
    subtotal: 7798, discount: 0, tax: 624, tip: 0, total: 8422,
    amountReceived: 9000, changeDue: 578, paymentMethod: 'cash', status: 'completed', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100244', date: '2026-09-02T11:48:00', customerId: 'c3', customerName: 'Priya Sharma',
    items: [
      { productId: 's2', name: 'Kanjivaram Silk Saree — Temple Green', quantity: 1, price: 7999, total: 7999 },
      { productId: 's14', name: 'Maheshwari Saree — Turquoise', quantity: 1, price: 2499, total: 2499 },
    ],
    subtotal: 10498, discount: 0, tax: 840, tip: 0, total: 11338,
    amountReceived: 4212, changeDue: 0, paymentMethod: 'card', status: 'paid', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100243', date: '2026-09-02T11:32:00', customerId: 'c2', customerName: 'Rajesh Kumar',
    items: [
      { productId: 's3', name: 'Chanderi Cotton Saree — Sky Blue', quantity: 2, price: 1899, total: 3798 },
      { productId: 's12', name: 'Patola Silk Saree — Multicolor', quantity: 1, price: 8999, total: 8999 },
    ],
    subtotal: 12797, discount: 200, tax: 1008, tip: 0, total: 13605,
    amountReceived: 6048, changeDue: 0, paymentMethod: 'upi', status: 'paid', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100242', date: '2026-09-02T11:15:00', customerId: 'c1', customerName: 'Walk-in Customer',
    items: [
      { productId: 's4', name: 'Chiffon Saree — Blush Pink', quantity: 1, price: 1499, total: 1499 },
      { productId: 's10', name: 'Organza Saree — Pastel Mint', quantity: 2, price: 3199, total: 6398 },
    ],
    subtotal: 7897, discount: 0, tax: 632, tip: 0, total: 8529,
    amountReceived: 9000, changeDue: 471, paymentMethod: 'cash', status: 'completed', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100241', date: '2026-09-02T10:59:00', customerId: 'c4', customerName: 'Amit Patel',
    items: [{ productId: 's9', name: 'Mysore Silk Saree — Royal Purple', quantity: 1, price: 6499, total: 6499 }],
    subtotal: 6499, discount: 0, tax: 520, tip: 100, total: 7119,
    amountReceived: 4960, changeDue: 0, paymentMethod: 'card', status: 'completed', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100240', date: '2026-09-02T10:41:00', customerId: 'c1', customerName: 'Walk-in Customer',
    items: [
      { productId: 's7', name: 'Linen Saree — Ivory White', quantity: 1, price: 2599, total: 2599 },
      { productId: 's8', name: 'Bandhani Saree — Festive Orange', quantity: 1, price: 2799, total: 2799 },
    ],
    subtotal: 5398, discount: 0, tax: 432, tip: 0, total: 5830,
    amountReceived: 6000, changeDue: 170, paymentMethod: 'cash', status: 'paid', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100239', date: '2026-09-01T16:20:00', customerId: 'c3', customerName: 'Priya Sharma',
    items: [{ productId: 's15', name: 'Net Embroidered Saree — Bridal Red', quantity: 1, price: 5999, total: 5999 }],
    subtotal: 5999, discount: 0, tax: 480, tip: 0, total: 6479,
    amountReceived: 3024, changeDue: 0, paymentMethod: 'upi', status: 'completed', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100238', date: '2026-09-01T10:22:00', customerId: 'c2', customerName: 'Rajesh Kumar',
    items: [{ productId: 's13', name: 'Crepe Saree — Charcoal Black', quantity: 2, price: 1799, total: 3598 }],
    subtotal: 3598, discount: 0, tax: 288, tip: 0, total: 3886,
    amountReceived: 1080, changeDue: 0, paymentMethod: 'cash', status: 'voided', cashier: 'Walk-in Cashier',
  },
];

const heldSales = [
  {
    id: 'HS-1001', heldAt: '2026-09-02T10:15:00', customerId: 'c1', customerName: 'Walk-in Customer',
    items: [
      { productId: 's1', name: 'Banarasi Silk Saree — Royal Red', quantity: 2, price: 5499, discount: 0, priceOverride: null },
      { productId: 's6', name: 'Tussar Silk Saree — Golden Beige', quantity: 1, price: 3999, discount: 0, priceOverride: null },
    ],
    billDiscount: 0, note: 'Customer selecting blouse stitching', heldBy: 'Alice Smith',
  },
  {
    id: 'HS-1002', heldAt: '2026-09-02T09:42:00', customerId: 'c2', customerName: 'John Davis',
    items: [
      { productId: 's3', name: 'Chanderi Cotton Saree — Sky Blue', quantity: 1, price: 1899, discount: 0, priceOverride: null },
      { productId: 's11', name: 'Ajrakh Cotton Saree — Indigo', quantity: 2, price: 1999, discount: 0, priceOverride: null },
    ],
    billDiscount: 100, note: '', heldBy: 'Michael Brown',
  },
  {
    id: 'HS-1003', heldAt: '2026-09-01T16:31:00', customerId: 'c1', customerName: 'Walk-in Customer',
    items: [
      { productId: 's2', name: 'Kanjivaram Silk Saree — Temple Green', quantity: 1, price: 7999, discount: 0, priceOverride: null },
      { productId: 's4', name: 'Chiffon Saree — Blush Pink', quantity: 2, price: 1499, discount: 0, priceOverride: null },
    ],
    billDiscount: 0, note: 'Waiting for family approval', heldBy: 'Alice Smith',
  },
];

const cashMovements = [
  { id: 'cm-001', type: 'in', amount: 5000, reason: 'Opening Float', timestamp: '2026-09-02T09:18:00', performedBy: 'Admin', notes: 'Opening cash for the shift' },
  { id: 'cm-002', type: 'out', amount: 500, reason: 'Petty Cash', timestamp: '2026-09-02T09:45:00', performedBy: 'Rohit S.', notes: 'Office supplies' },
  { id: 'cm-003', type: 'in', amount: 2000, reason: 'Bank Deposit', timestamp: '2026-09-02T10:30:00', performedBy: 'Admin', notes: 'Cash deposit from sales' },
  { id: 'cm-004', type: 'out', amount: 350, reason: 'Expense', timestamp: '2026-09-02T11:05:00', performedBy: 'Rohit S.', notes: 'Courier charges' },
  { id: 'cm-005', type: 'in', amount: 200, reason: 'Misc. Income', timestamp: '2026-09-02T12:20:00', performedBy: 'Admin', notes: 'Customer refund adjustment' },
];

const shifts = [
  {
    id: 'shift-001', status: 'open', openedAt: '2026-09-01T08:00:00',
    openedBy: 'Walk-in Cashier', openingCash: 5000, closedAt: null, closingCash: null, variance: null,
  },
];

function seedDatabase(db, isTableEmpty) {
  if (isTableEmpty('products')) {
    const stmt = db.prepare('INSERT INTO products (id, name, sku, barcode, price, category, stock) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (const p of products) stmt.run(p.id, p.name, p.sku, p.barcode, p.price, p.category, p.stock);
  }
  if (isTableEmpty('customers')) {
    const stmt = db.prepare('INSERT INTO customers (id, name, phone, email, is_default, loyalty_points, total_purchases, purchase_history) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const c of customers) {
      stmt.run(c.id, c.name, c.phone, c.email, c.isDefault ? 1 : 0, c.loyaltyPoints || 0, c.totalPurchases || 0, JSON.stringify(c.purchaseHistory || []));
    }
  }
  if (isTableEmpty('sales')) {
    const stmt = db.prepare(`INSERT INTO sales (id, date, customer_id, customer_name, items, subtotal, discount, tax, tip, notes, total, amount_received, change_due, payment_method, payments, status, cashier)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    for (const s of sales) {
      stmt.run(s.id, s.date, s.customerId, s.customerName, JSON.stringify(s.items), s.subtotal, s.discount, s.tax, s.tip || 0, s.notes || '',
        s.total, s.amountReceived ?? s.total, s.changeDue || 0, s.paymentMethod, JSON.stringify([{ method: s.paymentMethod, amount: s.total }]), s.status, s.cashier);
    }
  }
  if (isTableEmpty('held_sales')) {
    const stmt = db.prepare('INSERT INTO held_sales (id, held_at, customer_id, customer_name, items, bill_discount, note, held_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const h of heldSales) {
      stmt.run(h.id, h.heldAt, h.customerId, h.customerName, JSON.stringify(h.items), h.billDiscount, h.note, h.heldBy);
    }
  }
  if (isTableEmpty('cash_movements')) {
    const stmt = db.prepare('INSERT INTO cash_movements (id, type, amount, reason, timestamp, performed_by, notes) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (const m of cashMovements) stmt.run(m.id, m.type, m.amount, m.reason, m.timestamp, m.performedBy, m.notes);
  }
  if (isTableEmpty('shifts')) {
    const stmt = db.prepare('INSERT INTO shifts (id, status, opened_at, opened_by, opening_cash, closed_at, closing_cash, variance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const s of shifts) stmt.run(s.id, s.status, s.openedAt, s.openedBy, s.openingCash, s.closedAt, s.closingCash, s.variance);
  }
}

module.exports = { seedDatabase };
