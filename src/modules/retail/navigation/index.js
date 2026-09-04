import { retailConfig } from '../config/retail.config.js';

const base = retailConfig.routePrefix;

export const retailNavigation = {
  primary: [
    { label: 'New Sale', path: `${base}/new-sale`, icon: 'sale' },
    { label: 'Held Sales', path: `${base}/held-sales`, icon: 'held' },
    { label: 'Sales', path: `${base}/sales`, icon: 'sales' },
    { label: 'Returns & Exchanges', path: `${base}/returns`, icon: 'returns' },
    { label: 'Customers', path: `${base}/customers`, icon: 'customers' },
    { label: 'Current Shift', path: `${base}/shift`, icon: 'shift' },
    { label: 'Cash Movements', path: `${base}/cash-movements`, icon: 'cash' },
    { label: 'Help', path: `${base}/help`, icon: 'help' },
    { label: 'Profile', path: `${base}/profile`, icon: 'profile' },
  ],
  footer: [],
};

export { retailConfig };
