/**
 * REST routers for POS resources.
 * Row <-> API-object mapping keeps the API contract in camelCase,
 * matching the shapes the React store already uses.
 */
const express = require('express');
const { db } = require('./db');

function parseJson(value, fallback) {
  try {
    const parsed = JSON.parse(value ?? '');
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

const mapProduct = (r) => ({ ...r });
const mapCustomer = (r) => ({
  id: r.id,
  name: r.name,
  phone: r.phone || '',
  email: r.email || '',
  isDefault: r.is_default === 1,
  loyaltyPoints: r.loyalty_points || 0,
  totalPurchases: r.total_purchases || 0,
  purchaseHistory: parseJson(r.purchase_history, []),
});
const mapSale = (r) => ({
  id: r.id,
  date: r.date,
  customerId: r.customer_id,
  customerName: r.customer_name,
  items: parseJson(r.items, []),
  subtotal: r.subtotal || 0,
  discount: r.discount || 0,
  tax: r.tax || 0,
  tip: r.tip || 0,
  notes: r.notes || '',
  total: r.total || 0,
  amountReceived: r.amount_received ?? r.total ?? 0,
  changeDue: r.change_due || 0,
  paymentMethod: r.payment_method,
  payments: parseJson(r.payments, []),
  status: r.status,
  cashier: r.cashier,
});
const mapHeld = (r) => ({
  id: r.id,
  heldAt: r.held_at,
  customerId: r.customer_id,
  customerName: r.customer_name,
  items: parseJson(r.items, []),
  billDiscount: r.bill_discount || 0,
  note: r.note || '',
  heldBy: r.held_by,
});
const mapReturn = (r) => ({
  id: r.id,
  date: r.date,
  saleId: r.sale_id,
  items: parseJson(r.items, []),
  reason: r.reason,
  refundMethod: r.refund_method,
  subtotal: r.subtotal || 0,
  taxAdjustment: r.tax_adjustment || 0,
  refundAmount: r.refund_amount || 0,
  exchange: r.exchange === 1,
});
const mapMovement = (r) => ({
  id: r.id,
  type: r.type,
  amount: r.amount,
  reason: r.reason,
  timestamp: r.timestamp,
  performedBy: r.performed_by,
  notes: r.notes || '',
});
const mapShift = (r) => ({
  id: r.id,
  status: r.status,
  openedAt: r.opened_at,
  openedBy: r.opened_by,
  openingCash: r.opening_cash || 0,
  closedAt: r.closed_at,
  closingCash: r.closing_cash,
  variance: r.variance,
});

function notFound(res, entity, id) {
  return res.status(404).json({ error: `${entity} '${id}' not found` });
}

// ---------- Products ----------
const products = express.Router();
products.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY rowid').all();
  res.json(rows.map(mapProduct));
});
products.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!row) return notFound(res, 'Product', req.params.id);
  res.json(mapProduct(row));
});
products.post('/', (req, res) => {
  const { id, name, sku, barcode, price, category, stock = 0 } = req.body || {};
  if (!id || !name || price == null || !category) {
    return res.status(400).json({ error: 'id, name, price and category are required' });
  }
  try {
    db.prepare('INSERT INTO products (id, name, sku, barcode, price, category, stock) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, name, sku || '', barcode || '', Number(price), category, Number(stock) || 0);
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) return res.status(409).json({ error: `Product '${id}' already exists` });
    throw err;
  }
  res.status(201).json(mapProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(id)));
});
products.patch('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!row) return notFound(res, 'Product', req.params.id);
  const next = { ...mapProduct(row), ...(req.body || {}), id: row.id };
  db.prepare('UPDATE products SET name = ?, sku = ?, barcode = ?, price = ?, category = ?, stock = ? WHERE id = ?')
    .run(next.name, next.sku, next.barcode, Number(next.price), next.category, Number(next.stock) || 0, row.id);
  res.json(mapProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(row.id)));
});

// ---------- Customers ----------
const customers = express.Router();
customers.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM customers ORDER BY rowid').all().map(mapCustomer));
});
customers.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!row) return notFound(res, 'Customer', req.params.id);
  res.json(mapCustomer(row));
});
customers.post('/', (req, res) => {
  const { id, name, phone = '', email = '' } = req.body || {};
  if (!id || !name) return res.status(400).json({ error: 'id and name are required' });
  try {
    db.prepare('INSERT INTO customers (id, name, phone, email) VALUES (?, ?, ?, ?)').run(id, name, phone, email);
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) return res.status(409).json({ error: `Customer '${id}' already exists` });
    throw err;
  }
  res.status(201).json(mapCustomer(db.prepare('SELECT * FROM customers WHERE id = ?').get(id)));
});
customers.patch('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!row) return notFound(res, 'Customer', req.params.id);
  const body = req.body || {};
  db.prepare('UPDATE customers SET name = ?, phone = ?, email = ?, loyalty_points = ?, total_purchases = ? WHERE id = ?')
    .run(body.name ?? row.name, body.phone ?? row.phone, body.email ?? row.email,
      body.loyaltyPoints ?? row.loyalty_points, body.totalPurchases ?? row.total_purchases, row.id);
  res.json(mapCustomer(db.prepare('SELECT * FROM customers WHERE id = ?').get(row.id)));
});

// ---------- Sales ----------
const sales = express.Router();
sales.get('/', (req, res) => {
  const { status, limit } = req.query;
  let sql = 'SELECT * FROM sales';
  const params = [];
  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }
  sql += ' ORDER BY date DESC';
  if (limit && Number(limit) > 0) {
    sql += ' LIMIT ?';
    params.push(Number(limit));
  }
  res.json(db.prepare(sql).all(...params).map(mapSale));
});
sales.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM sales WHERE id = ?').get(req.params.id);
  if (!row) return notFound(res, 'Sale', req.params.id);
  res.json(mapSale(row));
});
sales.post('/', (req, res) => {
  const s = req.body || {};
  if (!s.id || !Array.isArray(s.items) || s.total == null || !s.paymentMethod) {
    return res.status(400).json({ error: 'id, items, total and paymentMethod are required' });
  }
  try {
    db.prepare(`INSERT INTO sales (id, date, customer_id, customer_name, items, subtotal, discount, tax, tip, notes, total,
        amount_received, change_due, payment_method, payments, status, cashier)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(s.id, s.date || new Date().toISOString(), s.customerId || null, s.customerName || 'Walk-in Customer',
        JSON.stringify(s.items), s.subtotal || 0, s.discount || 0, s.tax || 0, s.tip || 0, s.notes || '',
        s.total, s.amountReceived ?? s.total, s.changeDue || 0, s.paymentMethod,
        JSON.stringify(s.payments || [{ method: s.paymentMethod, amount: s.total }]),
        s.status || 'completed', s.cashier || null);
    // Decrement stock for sold items (never below zero).
    const dec = db.prepare('UPDATE products SET stock = MAX(stock - ?, 0) WHERE id = ?');
    for (const item of s.items) {
      if (item.productId && item.quantity > 0) dec.run(item.quantity, item.productId);
    }
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) return res.status(409).json({ error: `Sale '${s.id}' already exists` });
    throw err;
  }
  res.status(201).json(mapSale(db.prepare('SELECT * FROM sales WHERE id = ?').get(s.id)));
});
sales.patch('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM sales WHERE id = ?').get(req.params.id);
  if (!row) return notFound(res, 'Sale', req.params.id);
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ error: 'status is required' });
  db.prepare('UPDATE sales SET status = ? WHERE id = ?').run(status, row.id);
  res.json(mapSale(db.prepare('SELECT * FROM sales WHERE id = ?').get(row.id)));
});

// ---------- Held sales ----------
const heldSales = express.Router();
heldSales.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM held_sales ORDER BY held_at DESC').all().map(mapHeld));
});
heldSales.post('/', (req, res) => {
  const h = req.body || {};
  if (!h.id || !Array.isArray(h.items)) return res.status(400).json({ error: 'id and items are required' });
  try {
    db.prepare('INSERT INTO held_sales (id, held_at, customer_id, customer_name, items, bill_discount, note, held_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(h.id, h.heldAt || new Date().toISOString(), h.customerId || null, h.customerName || 'Walk-in Customer',
        JSON.stringify(h.items), h.billDiscount || 0, h.note || '', h.heldBy || null);
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) return res.status(409).json({ error: `Held sale '${h.id}' already exists` });
    throw err;
  }
  res.status(201).json(mapHeld(db.prepare('SELECT * FROM held_sales WHERE id = ?').get(h.id)));
});
heldSales.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM held_sales WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return notFound(res, 'Held sale', req.params.id);
  res.status(204).end();
});

// ---------- Returns ----------
const returns = express.Router();
returns.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM returns ORDER BY date DESC').all().map(mapReturn));
});
returns.post('/', (req, res) => {
  const r = req.body || {};
  if (!r.id || !r.saleId || !Array.isArray(r.items)) {
    return res.status(400).json({ error: 'id, saleId and items are required' });
  }
  try {
    db.prepare(`INSERT INTO returns (id, date, sale_id, items, reason, refund_method, subtotal, tax_adjustment, refund_amount, exchange)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(r.id, r.date || new Date().toISOString(), r.saleId, JSON.stringify(r.items), r.reason || '',
        r.refundMethod || 'cash', r.subtotal || 0, r.taxAdjustment || 0, r.refundAmount || 0, r.exchange ? 1 : 0);
    // Mark the original sale returned / partially returned.
    const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(r.saleId);
    if (sale) {
      const soldQty = parseJson(sale.items, []).reduce((sum, i) => sum + (i.quantity || 0), 0);
      const returnedQty = r.items.reduce((sum, i) => sum + (i.quantity || 0), 0);
      const status = returnedQty >= soldQty ? 'returned' : 'partial_return';
      db.prepare('UPDATE sales SET status = ? WHERE id = ?').run(status, r.saleId);
    }
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) return res.status(409).json({ error: `Return '${r.id}' already exists` });
    throw err;
  }
  res.status(201).json(mapReturn(db.prepare('SELECT * FROM returns WHERE id = ?').get(r.id)));
});

// ---------- Cash movements ----------
const cashMovements = express.Router();
cashMovements.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM cash_movements ORDER BY timestamp DESC').all().map(mapMovement));
});
cashMovements.post('/', (req, res) => {
  const m = req.body || {};
  if (!m.id || !m.type || !(Number(m.amount) > 0)) {
    return res.status(400).json({ error: 'id, type and a positive amount are required' });
  }
  if (!['in', 'out'].includes(m.type)) return res.status(400).json({ error: "type must be 'in' or 'out'" });
  try {
    db.prepare('INSERT INTO cash_movements (id, type, amount, reason, timestamp, performed_by, notes) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(m.id, m.type, Number(m.amount), m.reason || '', m.timestamp || new Date().toISOString(), m.performedBy || '', m.notes || '');
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) return res.status(409).json({ error: `Movement '${m.id}' already exists` });
    throw err;
  }
  res.status(201).json(mapMovement(db.prepare('SELECT * FROM cash_movements WHERE id = ?').get(m.id)));
});

// ---------- Shifts ----------
const shifts = express.Router();
shifts.get('/current', (req, res) => {
  const row = db.prepare('SELECT * FROM shifts ORDER BY opened_at DESC LIMIT 1').get();
  if (!row) return res.status(404).json({ error: 'No shift found' });
  res.json(mapShift(row));
});
shifts.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM shifts ORDER BY opened_at DESC').all().map(mapShift));
});
shifts.post('/', (req, res) => {
  const s = req.body || {};
  const id = s.id || `SHIFT-${Date.now().toString(36).toUpperCase()}`;
  try {
    db.prepare('INSERT INTO shifts (id, status, opened_at, opened_by, opening_cash) VALUES (?, ?, ?, ?, ?)')
      .run(id, 'open', s.openedAt || new Date().toISOString(), s.openedBy || 'Cashier', Number(s.openingCash) || 0);
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) return res.status(409).json({ error: `Shift '${id}' already exists` });
    throw err;
  }
  res.status(201).json(mapShift(db.prepare('SELECT * FROM shifts WHERE id = ?').get(id)));
});
shifts.post('/:id/close', (req, res) => {
  const row = db.prepare('SELECT * FROM shifts WHERE id = ?').get(req.params.id);
  if (!row) return notFound(res, 'Shift', req.params.id);
  if (row.status === 'closed') return res.status(409).json({ error: `Shift '${row.id}' is already closed` });
  const { closingCash = 0, variance = 0 } = req.body || {};
  db.prepare('UPDATE shifts SET status = ?, closed_at = ?, closing_cash = ?, variance = ? WHERE id = ?')
    .run('closed', new Date().toISOString(), Number(closingCash) || 0, Number(variance) || 0, row.id);
  res.json(mapShift(db.prepare('SELECT * FROM shifts WHERE id = ?').get(row.id)));
});

module.exports = { products, customers, sales, heldSales, returns, cashMovements, shifts };
