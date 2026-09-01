import { Route, Navigate } from 'react-router-dom';
import { retailConfig } from '../config/retail.config.js';
import { RetailLayout } from '../layouts/RetailLayout.jsx';
import { NewSaleScreen } from '../screens/new-sale/NewSaleScreen.jsx';
import { HeldSalesScreen } from '../screens/held-sales/HeldSalesScreen.jsx';
import { SalesScreen } from '../screens/sales/SalesScreen.jsx';
import { ReturnsScreen } from '../screens/returns/ReturnsScreen.jsx';
import { CustomersScreen } from '../screens/customers/CustomersScreen.jsx';
import { ShiftScreen } from '../screens/shift/ShiftScreen.jsx';
import { CashMovementsScreen } from '../screens/cash-movements/CashMovementsScreen.jsx';
import { HelpScreen } from '../screens/help/HelpScreen.jsx';
import { ProfileScreen } from '../screens/profile/ProfileScreen.jsx';

const base = retailConfig.routePrefix;

export const retailRoutes = [
  <Route key="retail" path={base} element={<RetailLayout />}>
    <Route index element={<Navigate to="new-sale" replace />} />
    <Route path="new-sale" element={<NewSaleScreen />} />
    <Route path="held-sales" element={<HeldSalesScreen />} />
    <Route path="sales" element={<SalesScreen />} />
    <Route path="returns" element={<ReturnsScreen />} />
    <Route path="customers" element={<CustomersScreen />} />
    <Route path="shift" element={<ShiftScreen />} />
    <Route path="cash-movements" element={<CashMovementsScreen />} />
    <Route path="help" element={<HelpScreen />} />
    <Route path="profile" element={<ProfileScreen />} />
  </Route>,
];
