export const customers = [
  {
    id: 'c1',
    name: 'Walk-in Customer',
    phone: '',
    email: '',
    isDefault: true,
    loyaltyPoints: 0,
    totalPurchases: 0,
    purchaseHistory: [],
  },
  {
    id: 'c2',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@email.com',
    loyaltyPoints: 450,
    totalPurchases: 12500,
    purchaseHistory: [
      { id: 's1', date: '2026-08-28T10:30:00', total: 1250, items: 5 },
      { id: 's2', date: '2026-08-15T14:20:00', total: 890, items: 3 },
    ],
  },
  {
    id: 'c3',
    name: 'Priya Sharma',
    phone: '+91 87654 32109',
    email: 'priya@email.com',
    loyaltyPoints: 820,
    totalPurchases: 24800,
    purchaseHistory: [
      { id: 's3', date: '2026-08-30T11:45:00', total: 2340, items: 8 },
      { id: 's4', date: '2026-08-22T16:10:00', total: 1560, items: 6 },
      { id: 's5', date: '2026-08-10T09:30:00', total: 980, items: 4 },
    ],
  },
  {
    id: 'c4',
    name: 'Amit Patel',
    phone: '+91 76543 21098',
    email: 'amit@email.com',
    loyaltyPoints: 120,
    totalPurchases: 3200,
    purchaseHistory: [
      { id: 's6', date: '2026-08-25T13:00:00', total: 650, items: 2 },
    ],
  },
];
