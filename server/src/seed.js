/**
 * Seed data — Takshi master product list + matching demo transactions.
 * Only inserted into empty tables on first boot.
 */
const products = [
  { id: 'p1', name: 'Kanjivaram Silk Saree — Red Gold Zari', sku: 'KK5000401', barcode: 'KK5000401', price: 245, category: 'Kanjivaram', stock: 20, image: '/images/products/p1.jpg', swatch: 'linear-gradient(135deg,#b91c1c,#d97706)' },
  { id: 'p2', name: 'Kanjivaram Silk Saree — Green Gold Zari', sku: 'KK5000402', barcode: 'KK5000402', price: 320, category: 'Green Gold', stock: 5, image: '/images/products/p2.jpg', swatch: 'linear-gradient(135deg,#047857,#65a30d)' },
  { id: 'p3', name: 'Banarasi Silk Saree', sku: 'BSL00401', barcode: 'BSL00401', price: 935, category: 'Banarasi Silk', stock: 66, image: '/images/products/p3.jpg', swatch: 'linear-gradient(135deg,#ea580c,#be123c)' },
  { id: 'p4', name: 'Soft Silk Saree', sku: 'SSL00402', barcode: 'SSL00402', price: 435, category: 'Soft Silk', stock: 23, image: '/images/products/p4.jpg', swatch: 'linear-gradient(135deg,#ec4899,#a21caf)' },
  { id: 'p5', name: 'Cotton Saree', sku: 'COT00308', barcode: 'COT00308', price: 330, category: 'Cotton Saree', stock: 12, image: '/images/products/p5.jpg', swatch: 'linear-gradient(135deg,#0284c7,#4338ca)' },
  { id: 'p6', name: 'Chanderi Saree', sku: 'FS500322', barcode: 'FS500322', price: 350, category: 'Cotton Saree', stock: 6, image: '/images/products/p6.webp', swatch: 'linear-gradient(135deg,#fb7185,#f97316)' },
  { id: 'p7', name: 'Chanderi Saree', sku: 'HK500304', barcode: 'HK500304', price: 300, category: 'Saree', stock: 20, image: '/images/products/p7.jpg', swatch: 'linear-gradient(135deg,#65a30d,#047857)' },
  { id: 'p8', name: 'Mysore Silk Saree', sku: 'MYS00501', barcode: 'MYS00501', price: 520, category: 'Mysore Silk', stock: 15, image: '/images/products/p8.jpg', swatch: 'linear-gradient(135deg,#7c3aed,#6b21a8)' },
  { id: 'p9', name: 'Organza Saree', sku: 'ORG00601', barcode: 'ORG00601', price: 275, category: 'Saree', stock: 0, image: '/images/products/p9.jpg', swatch: 'linear-gradient(135deg,#14b8a6,#0e7490)' },
  { id: 'p10', name: 'Linen Saree', sku: 'LIN00702', barcode: 'LIN00702', price: 310, category: 'Linen', stock: 9, image: '/images/products/p10.jpg', swatch: 'linear-gradient(135deg,#78716c,#b45309)' },
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
      { productId: 'p1', name: 'Kanjivaram Silk Saree — Red Gold Zari', quantity: 1, price: 245, total: 245 },
      { productId: 'p3', name: 'Banarasi Silk Saree', quantity: 1, price: 935, total: 935 },
    ],
    subtotal: 1180, discount: 0, tax: 94.4, tip: 0, total: 1274.4,
    amountReceived: 1300, changeDue: 25.6, paymentMethod: 'cash', status: 'completed', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100244', date: '2026-09-02T11:48:00', customerId: 'c3', customerName: 'Priya Sharma',
    items: [
      { productId: 'p8', name: 'Mysore Silk Saree', quantity: 2, price: 520, total: 1040 },
      { productId: 'p5', name: 'Cotton Saree', quantity: 1, price: 330, total: 330 },
    ],
    subtotal: 1370, discount: 0, tax: 109.6, tip: 0, total: 1479.6,
    amountReceived: 1479.6, changeDue: 0, paymentMethod: 'card', status: 'paid', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100243', date: '2026-09-02T11:32:00', customerId: 'c2', customerName: 'Rajesh Kumar',
    items: [
      { productId: 'p4', name: 'Soft Silk Saree', quantity: 1, price: 435, total: 435 },
      { productId: 'p10', name: 'Linen Saree', quantity: 1, price: 310, total: 310 },
      { productId: 'p6', name: 'Chanderi Saree', quantity: 1, price: 350, total: 350 },
    ],
    subtotal: 1095, discount: 0, tax: 87.6, tip: 0, total: 1182.6,
    amountReceived: 1182.6, changeDue: 0, paymentMethod: 'upi', status: 'paid', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100242', date: '2026-09-02T11:15:00', customerId: 'c1', customerName: 'Walk-in Customer',
    items: [
      { productId: 'p2', name: 'Kanjivaram Silk Saree — Green Gold Zari', quantity: 1, price: 320, total: 320 },
    ],
    subtotal: 320, discount: 0, tax: 25.6, tip: 0, total: 345.6,
    amountReceived: 345.6, changeDue: 0, paymentMethod: 'cash', status: 'completed', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100241', date: '2026-09-02T10:59:00', customerId: 'c4', customerName: 'Amit Patel',
    items: [
      { productId: 'p3', name: 'Banarasi Silk Saree', quantity: 1, price: 935, total: 935 },
      { productId: 'p7', name: 'Chanderi Saree', quantity: 2, price: 300, total: 600 },
    ],
    subtotal: 1535, discount: 0, tax: 122.8, tip: 0, total: 1657.8,
    amountReceived: 1657.8, changeDue: 0, paymentMethod: 'card', status: 'completed', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100240', date: '2026-09-02T10:41:00', customerId: 'c1', customerName: 'Walk-in Customer',
    items: [
      { productId: 'p5', name: 'Cotton Saree', quantity: 2, price: 330, total: 660 },
    ],
    subtotal: 660, discount: 0, tax: 52.8, tip: 0, total: 712.8,
    amountReceived: 800, changeDue: 87.2, paymentMethod: 'cash', status: 'paid', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100239', date: '2026-09-01T16:20:00', customerId: 'c3', customerName: 'Priya Sharma',
    items: [
      { productId: 'p10', name: 'Linen Saree', quantity: 1, price: 310, total: 310 },
    ],
    subtotal: 310, discount: 0, tax: 24.8, tip: 0, total: 334.8,
    amountReceived: 334.8, changeDue: 0, paymentMethod: 'upi', status: 'completed', cashier: 'Walk-in Cashier',
  },
  {
    id: 'ORD-100238', date: '2026-09-01T10:22:00', customerId: 'c2', customerName: 'Rajesh Kumar',
    items: [
      { productId: 'p6', name: 'Chanderi Saree', quantity: 1, price: 350, total: 350 },
    ],
    subtotal: 350, discount: 0, tax: 28, tip: 0, total: 378,
    amountReceived: 378, changeDue: 0, paymentMethod: 'cash', status: 'voided', cashier: 'Walk-in Cashier',
  },
];

const heldSales = [
  {
    id: 'HS-1001', heldAt: '2026-09-02T10:15:00', customerId: 'c1', customerName: 'Walk-in Customer',
    items: [
      { productId: 'p1', name: 'Kanjivaram Silk Saree — Red Gold Zari', quantity: 1, price: 245, discount: 0, priceOverride: null },
      { productId: 'p4', name: 'Soft Silk Saree', quantity: 1, price: 435, discount: 0, priceOverride: null },
    ],
    billDiscount: 0, note: 'Customer went to check size', heldBy: 'Alice Smith',
  },
  {
    id: 'HS-1002', heldAt: '2026-09-02T09:42:00', customerId: 'c2', customerName: 'John Davis',
    items: [
      { productId: 'p3', name: 'Banarasi Silk Saree', quantity: 1, price: 935, discount: 0, priceOverride: null },
      { productId: 'p8', name: 'Mysore Silk Saree', quantity: 1, price: 520, discount: 0, priceOverride: null },
    ],
    billDiscount: 0, note: '', heldBy: 'Michael Brown',
  },
  {
    id: 'HS-1003', heldAt: '2026-09-01T16:31:00', customerId: 'c1', customerName: 'Walk-in Customer',
    items: [
      { productId: 'p5', name: 'Cotton Saree', quantity: 2, price: 330, discount: 0, priceOverride: null },
      { productId: 'p7', name: 'Chanderi Saree', quantity: 1, price: 300, discount: 0, priceOverride: null },
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
    const stmt = db.prepare('INSERT INTO products (id, name, sku, barcode, price, category, stock, swatch, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (const p of products) stmt.run(p.id, p.name, p.sku, p.barcode, p.price, p.category, p.stock, p.swatch || '', p.image || '');
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
