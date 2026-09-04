export const initialHeldSales = [
  {
    id: 'HS-1001',
    heldAt: '2026-09-02T10:15:00',
    customerId: 'c1',
    customerName: 'Walk-in Customer',
    items: [
      { productId: 'p1', name: 'White Shirt', quantity: 2, price: 1200, discount: 0, priceOverride: null },
      { productId: 'p11', name: 'Black Belt', quantity: 1, price: 400, discount: 0, priceOverride: null },
      { productId: 'p2', name: 'Blue T-Shirt', quantity: 1, price: 500, discount: 0, priceOverride: null },
    ],
    billDiscount: 0,
    note: 'Customer went to check size',
    heldBy: 'Alice Smith',
  },
  {
    id: 'HS-1002',
    heldAt: '2026-09-02T09:42:00',
    customerId: 'c2',
    customerName: 'John Davis',
    items: [
      { productId: 'p3', name: 'Denim Jeans', quantity: 1, price: 1500, discount: 0, priceOverride: null },
      { productId: 'p8', name: 'Navy Polo', quantity: 2, price: 900, discount: 0, priceOverride: null },
    ],
    billDiscount: 100,
    note: '',
    heldBy: 'Michael Brown',
  },
  {
    id: 'HS-1003',
    heldAt: '2026-09-01T16:31:00',
    customerId: 'c1',
    customerName: 'Walk-in Customer',
    items: [
      { productId: 'p6', name: 'Red Silk Saree', quantity: 1, price: 3500, discount: 0, priceOverride: null },
      { productId: 'p5', name: 'Yellow Top', quantity: 3, price: 600, discount: 0, priceOverride: null },
      { productId: 'p9', name: 'Floral Top', quantity: 2, price: 700, discount: 0, priceOverride: null },
    ],
    billDiscount: 0,
    note: 'Waiting for family approval',
    heldBy: 'Alice Smith',
  },
];
