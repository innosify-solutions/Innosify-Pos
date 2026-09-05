/**
 * SQLite connection + schema.
 * Uses the built-in `node:sqlite` module (Node >= 22) — no native dependencies.
 * Database file lives in `server/data/pos.db` (gitignored).
 */
const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'pos.db');

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT NOT NULL,
    barcode TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    swatch TEXT DEFAULT '',
    image TEXT DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    is_default INTEGER NOT NULL DEFAULT 0,
    loyalty_points INTEGER NOT NULL DEFAULT 0,
    total_purchases REAL NOT NULL DEFAULT 0,
    purchase_history TEXT NOT NULL DEFAULT '[]'
  );
  CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    customer_id TEXT,
    customer_name TEXT,
    items TEXT NOT NULL DEFAULT '[]',
    subtotal REAL NOT NULL DEFAULT 0,
    discount REAL NOT NULL DEFAULT 0,
    tax REAL NOT NULL DEFAULT 0,
    tip REAL NOT NULL DEFAULT 0,
    notes TEXT DEFAULT '',
    total REAL NOT NULL DEFAULT 0,
    amount_received REAL NOT NULL DEFAULT 0,
    change_due REAL NOT NULL DEFAULT 0,
    payment_method TEXT,
    payments TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'completed',
    cashier TEXT
  );
  CREATE TABLE IF NOT EXISTS held_sales (
    id TEXT PRIMARY KEY,
    held_at TEXT,
    customer_id TEXT,
    customer_name TEXT,
    items TEXT NOT NULL DEFAULT '[]',
    bill_discount REAL NOT NULL DEFAULT 0,
    note TEXT DEFAULT '',
    held_by TEXT
  );
  CREATE TABLE IF NOT EXISTS returns (
    id TEXT PRIMARY KEY,
    date TEXT,
    sale_id TEXT,
    items TEXT NOT NULL DEFAULT '[]',
    reason TEXT,
    refund_method TEXT,
    subtotal REAL NOT NULL DEFAULT 0,
    tax_adjustment REAL NOT NULL DEFAULT 0,
    refund_amount REAL NOT NULL DEFAULT 0,
    exchange INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS cash_movements (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    reason TEXT,
    timestamp TEXT,
    performed_by TEXT,
    notes TEXT DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS shifts (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'open',
    opened_at TEXT,
    opened_by TEXT,
    opening_cash REAL NOT NULL DEFAULT 0,
    closed_at TEXT,
    closing_cash REAL,
    variance REAL
  );
`);

function isTableEmpty(table) {
  const row = db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get();
  return row.n === 0;
}

// Lightweight migration for databases created before a column existed.
const productCols = db.prepare('PRAGMA table_info(products)').all();
if (!productCols.some((c) => c.name === 'swatch')) {
  db.exec("ALTER TABLE products ADD COLUMN swatch TEXT DEFAULT ''");
}
if (!productCols.some((c) => c.name === 'image')) {
  db.exec("ALTER TABLE products ADD COLUMN image TEXT DEFAULT ''");
}

module.exports = { db, isTableEmpty };
