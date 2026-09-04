/**
 * Seed data — mirrors the frontend demo catalog (clothing retail).
 * Only inserted into empty tables on first boot.
 */
const products = [
  { id: 'p1', name: 'White Shirt', sku: '200001', barcode: '200001', price: 1200, category: 'clothing', stock: 50 },
  { id: 'p2', name: 'Blue T-Shirt', sku: '200002', barcode: '200002', price: 500, category: 'clothing', stock: 100 },
  { id: 'p3', name: 'Denim Jeans', sku: '200003', barcode: '200003', price: 1500, category: 'clothing', stock: 40 },
  { id: 'p4', name: 'Red Kurta', sku: '200004', barcode: '200004', price: 800, category: 'ethnic', stock: 60 },
  { id: 'p5', name: 'Yellow Top', sku: '200005', barcode: '200005', price: 600, category: 'western', stock: 30 },
  { id: 'p6', name: 'Red Silk Saree', sku: '200006', barcode: '200006', price: 3500, category: 'sarees', stock: 15 },
  { id: 'p7', name: 'Green Chiffon Saree', sku: '200007', barcode: '200007', price: 2100, category: 'sarees', stock: 25 },
  { id: 'p8', name: 'Navy Polo', sku: '200008', barcode: '200008', price: 900, category: 'clothing', stock: 45 },
  { id: 'p9', name: 'Floral Top', sku: '200009', barcode: '200009', price: 700, category: 'western', stock: 35 },
  { id: 'p10', name: 'White Kurti', sku: '200010', barcode: '200010', price: 1200, category: 'ethnic', stock: 30 },
  { id: 'p11', name: 'Black Belt', sku: '200011', barcode: '200011', price: 400, category: 'accessories', stock: 80 },
  { id: 'p12', name: 'Grey Hoodie', sku: '200012', barcode: '200012', price: 1100, category: 'clothing', stock: 20 },
  { id: 'p13', name: 'Pink Embroidered Saree', sku: '200013', barcode: '200013', price: 4500, category: 'sarees', stock: 10 },
  { id: 'p14', name: 'Black Trousers', sku: '200014', barcode: '200014', price: 1600, category: 'clothing', stock: 30 },
  { id: 'p15', name: 'Mustard Yellow Saree', sku: '200015', barcode: '200015', price: 2800, category: 'sarees', stock: 22 },
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
      { productId: 'p1', name: 'White Shirt', quantity: 1, price: 1200, total: 1200 },
      { productId: 'p2', name: 'Blue T-Shirt', quantity: 1, price: 500, total: 500 },
      { productId: 'p4', name: 'Red Kurta', quantity: 1, price: 800, total: 800 },
      { productId: 'p8', name: 'Navy Polo', quantity: 1, price: 900, total: 900 },
    ],
    subtotal: 3400, discount: 0, tax: 272, tip: 0, total: 3672,
    amountReceived: 4000, changeDue: 328, paymentMethod: 'cash', status: 'completed', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100244', date: '2026-09-02T11:48:00', customerId: 'c3', customerName: 'Priya Sharma',
    items: [
      { productId: 'p6', name: 'Red Silk Saree', quantity: 1, price: 3500, total: 3500 },
      { productId: 'p11', name: 'Black Belt', quantity: 1, price: 400, total: 400 },
    ],
    subtotal: 3900, discount: 0, tax: 312, tip: 0, total: 4212,
    amountReceived: 4212, changeDue: 0, paymentMethod: 'card', status: 'paid', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100243', date: '2026-09-02T11:32:00', customerId: 'c2', customerName: 'Rajesh Kumar',
    items: [
      { productId: 'p3', name: 'Denim Jeans', quantity: 2, price: 1500, total: 3000 },
      { productId: 'p12', name: 'Grey Hoodie', quantity: 1, price: 1100, total: 1100 },
      { productId: 'p14', name: 'Black Trousers', quantity: 1, price: 1600, total: 1600 },
    ],
    subtotal: 5700, discount: 100, tax: 448, tip: 0, total: 6048,
    amountReceived: 6048, changeDue: 0, paymentMethod: 'upi', status: 'paid', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100242', date: '2026-09-02T11:15:00', customerId: 'c1', customerName: 'Walk-in Customer',
    items: [
      { productId: 'p5', name: 'Yellow Top', quantity: 1, price: 600, total: 600 },
      { productId: 'p9', name: 'Floral Top', quantity: 2, price: 700, total: 1400 },
    ],
    subtotal: 2000, discount: 0, tax: 160, tip: 0, total: 2160,
    amountReceived: 2160, changeDue: 0, paymentMethod: 'cash', status: 'completed', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100241', date: '2026-09-02T10:59:00', customerId: 'c4', customerName: 'Amit Patel',
    items: [{ productId: 'p13', name: 'Pink Embroidered Saree', quantity: 1, price: 4500, total: 4500 }],
    subtotal: 4500, discount: 0, tax: 360, tip: 100, total: 4960,
    amountReceived: 4960, changeDue: 0, paymentMethod: 'card', status: 'completed', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100240', date: '2026-09-02T10:41:00', customerId: 'c1', customerName: 'Walk-in Customer',
    items: [
      { productId: 'p10', name: 'White Kurti', quantity: 1, price: 1200, total: 1200 },
      { productId: 'p7', name: 'Green Chiffon Saree', quantity: 1, price: 2100, total: 2100 },
    ],
    subtotal: 3300, discount: 0, tax: 264, tip: 0, total: 3564,
    amountReceived: 4000, changeDue: 436, paymentMethod: 'cash', status: 'paid', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100239', date: '2026-09-01T16:20:00', customerId: 'c3', customerName: 'Priya Sharma',
    items: [{ productId: 'p15', name: 'Mustard Yellow Saree', quantity: 1, price: 2800, total: 2800 }],
    subtotal: 2800, discount: 0, tax: 224, tip: 0, total: 3024,
    amountReceived: 3024, changeDue: 0, paymentMethod: 'upi', status: 'completed', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100238', date: '2026-09-01T10:22:00', customerId: 'c2', customerName: 'Rajesh Kumar',
    items: [{ productId: 'p2', name: 'Blue T-Shirt', quantity: 2, price: 500, total: 1000 }],
    subtotal: 1000, discount: 0, tax: 80, tip: 0, total: 1080,
    amountReceived: 1080, changeDue: 0, paymentMethod: 'cash', status: 'voided', cashier: 'Walk-in Cashier',
  },
];

const heldSales = [
  {
    id: 'HS-1001', heldAt: '2026-09-02T10:15:00', customerId: 'c1', customerName: 'Walk-in Customer',
    items: [
      { productId: 'p1', name: 'White Shirt', quantity: 2, price: 1200, discount: 0, priceOverride: null },
      { productId: 'p11', name: 'Black Belt', quantity: 1, price: 400, discount: 0, priceOverride: null },
      { productId: 'p2', name: 'Blue T-Shirt', quantity: 1, price: 500, discount: 0, priceOverride: null },
    ],
    billDiscount: 0, note: 'Customer went to check size', heldBy: 'Alice Smith',
  },
  {
    id: 'HS-1002', heldAt: '2026-09-02T09:42:00', customerId: 'c2', customerName: 'John Davis',
    items: [
      { productId: 'p3', name: 'Denim Jeans', quantity: 1, price: 1500, discount: 0, priceOverride: null },
      { productId: 'p8', name: 'Navy Polo', quantity: 2, price: 900, discount: 0, priceOverride: null },
    ],
    billDiscount: 100, note: '', heldBy: 'Michael Brown',
  },
  {
    id: 'HS-1003', heldAt: '2026-09-01T16:31:00', customerId: 'c1', customerName: 'Walk-in Customer',
    items: [
      { productId: 'p6', name: 'Red Silk Saree', quantity: 1, price: 3500, discount: 0, priceOverride: null },
      { productId: 'p5', name: 'Yellow Top', quantity: 3, price: 600, discount: 0, priceOverride: null },
      { productId: 'p9', name: 'Floral Top', quantity: 2, price: 700, discount: 0, priceOverride: null },
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
