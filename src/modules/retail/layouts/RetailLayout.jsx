import { Outlet } from 'react-router-dom';
import { CashierProvider } from '../store';

export function RetailLayout() {
  return (
    <CashierProvider>
      <Outlet />
    </CashierProvider>
  );
}
