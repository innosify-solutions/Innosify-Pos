/**
 * Innosify POS backend — Express + SQLite REST API.
 *
 * Run:  npm --prefix server start   (or `npm run server` from the repo root)
 * Env:  PORT (default 3001), DB_PATH (default server/data/pos.db)
 */
const express = require('express');
const cors = require('cors');
const { db, isTableEmpty } = require('./db');
const { seedDatabase } = require('./seed');
const routes = require('./routes');

const PORT = Number(process.env.PORT) || 3001;

seedDatabase(db, isTableEmpty);

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {
  const started = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - started}ms`);
  });
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'innosify-pos-server', time: new Date().toISOString() });
});

app.use('/api/products', routes.products);
app.use('/api/customers', routes.customers);
app.use('/api/sales', routes.sales);
app.use('/api/held-sales', routes.heldSales);
app.use('/api/returns', routes.returns);
app.use('/api/cash-movements', routes.cashMovements);
app.use('/api/shifts', routes.shifts);

app.use('/api', (req, res) => {
  res.status(404).json({ error: `Unknown endpoint ${req.method} ${req.originalUrl}` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Innosify POS API listening on http://localhost:${PORT}`);
});
