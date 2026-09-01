import { retailConfig } from '../config/retail.config.js';

const base = retailConfig.routePrefix;

export const retailNavigation = {
  primary: [
    { label: 'New Sale', path: `${base}/new-sale` },
    { label: 'Held Sales', path: `${base}/held-sales` },
    { label: 'Sales', path: `${base}/sales` },
    { label: 'Returns & Exchanges', path: `${base}/returns` },
    { label: 'Customers', path: `${base}/customers` },
    { label: 'Current Shift', path: `${base}/shift` },
    { label: 'Cash Movements', path: `${base}/cash-movements` },
  ],
  footer: [
    { label: 'Help', path: `${base}/help` },
    { label: 'Profile', path: `${base}/profile` },
  ],
};

export { retailConfig };
