# Retail Cashier — Feature Documentation

Feature documentation for the Retail Cashier UI. For overall architecture, see [ARCHITECTURE.md](../../ARCHITECTURE.md).

## Overview

The Retail Cashier module provides a complete POS cashier workflow for retail stores. All code lives inside `src/modules/retail/` following the module boundary defined in ARCHITECTURE.md.

## Navigation

Single-level navigation with primary and footer sections:

| Section | Items |
|---------|-------|
| Primary | New Sale, Held Sales, Sales, Returns & Exchanges, Customers, Current Shift, Cash Movements |
| Footer | Help, Profile |

Navigation is defined in `modules/retail/navigation/index.js` and rendered by `@core/navigation/NavigationShell`.

## Folder Structure

```
modules/retail/
├── config/retail.config.js       # Module config (id, route prefix)
├── constants/cashier.constants.js # Tax rate, payment methods, statuses
├── data/                          # Mock data (products, customers, sales, etc.)
├── utils/cashier.utils.js         # Formatting, cart calculations, product filtering
├── store/CashierContext.jsx       # Module-level state (cart, sales, shift, etc.)
├── components/pos/                # Retail POS-specific components
├── layouts/                         # RetailLayout (provider wrapper), RetailPage
├── navigation/                      # Routes and nav items
└── screens/                         # Feature screens by folder
    ├── new-sale/
    ├── held-sales/
    ├── sales/
    ├── returns/
    ├── customers/
    ├── shift/
    ├── cash-movements/
    ├── help/
    └── profile/
```

## State Management

`CashierProvider` in `store/CashierContext.jsx` manages all cashier state:

- **Cart** — items, quantities, discounts, price overrides, bill discount
- **Customers** — list, selection, add/edit
- **Sales** — completed transactions
- **Held Sales** — suspended carts
- **Shift** — open/close register, summaries
- **Cash Movements** — cash in/out records

State is module-scoped (not global `store/`). Wraps all retail routes via `RetailLayout`.

## Cashier Flows

### New Sale

Full POS interface with product grid + cart panel. Flow uses contextual modals:

1. Scan/search product → add to cart
2. Select customer (modal)
3. Edit item (discount/price override modal)
4. Apply bill discount (modal)
5. Hold sale (confirmation)
6. Checkout → review order (modal)
7. Payment — cash/card/UPI/split (modal)
8. Sale completed (modal)
9. Receipt preview (modal) → New Sale

The New Sale screen uses full-bleed layout (no page padding) for maximum workspace.

### Held Sales

List held sales with search, detail drawer, resume, and delete.

### Sales

Transaction list with search, date filter tabs, detail drawer, reprint receipt, return/exchange link, void.

### Returns & Exchanges

Multi-step wizard: Find Sale → Select Items → Quantity → Return/Exchange → Refund Method → Confirm.

### Customers

Customer list with search, add/edit modal, detail drawer with purchase history inline.

### Current Shift

Shift status, opening cash, sales/payment summaries, expected cash, close register with cash counting and variance.

### Cash Movements

Cash in/out with reason, amount, history table, confirmation.

## Shared vs Retail Components

| Location | Components |
|----------|-----------|
| `shared/` | Button, Input, SearchField, Select, Modal, Drawer, Table, Badge, Tabs, EmptyState, LoadingState, ConfirmationDialog |
| `modules/retail/components/pos/` | ProductCard, CartItem, CartSummary, PaymentMethodCard, CategoryFilter, ReceiptPreview |

## Mock Data

All mock data is in `modules/retail/data/`. Components import from there or receive data via `useCashier()`. No mock data embedded in JSX.

## Key UI Decisions

1. **Full-bleed New Sale** — POS screen uses entire main area without padding for product grid + cart panel layout.
2. **Modal-based secondary actions** — Customer selection, payment, discounts, and checkout use modals to keep the main POS view uncluttered.
3. **Single-level navigation** — No nested menus; all cashier features are one click away.
4. **Purchase history in customer details** — No separate Customer History nav item.
5. **Barcode workflow** — Search field accepts barcode on Enter key; auto-adds matching product to cart.

## Routes

All routes are under `/retail/`:

| Path | Screen |
|------|--------|
| `/retail` | Redirects to `/retail/new-sale` |
| `/retail/new-sale` | New Sale (POS) |
| `/retail/held-sales` | Held Sales |
| `/retail/sales` | Sales History |
| `/retail/returns` | Returns & Exchanges |
| `/retail/customers` | Customers |
| `/retail/shift` | Current Shift |
| `/retail/cash-movements` | Cash Movements |
| `/retail/help` | Help |
| `/retail/profile` | Profile |

## Adding a New Cashier Feature

1. Create screen folder under `screens/<feature>/`
2. Add retail-specific components under `components/` if needed
3. Register route in `navigation/routes.jsx`
4. Add nav item in `navigation/index.js`
5. Extend `CashierContext` if shared state is needed
6. Add mock data in `data/` if needed
7. Update this document
