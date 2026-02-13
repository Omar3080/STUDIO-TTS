import { Navigate, createBrowserRouter } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import CustomersPage from '../pages/CustomersPage';
import ProductsPage from '../pages/ProductsPage';
import InvoicesPage from '../pages/InvoicesPage';
import ReturnsPage from '../pages/ReturnsPage';
import PaymentsPage from '../pages/PaymentsPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';
import UsersPage from '../pages/UsersPage';

const Guard = ({ children }) => localStorage.getItem('token') ? children : <Navigate to="/login" replace />;

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <Guard><AppLayout /></Guard>,
    children: [
      { path: '', element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'sales', element: <InvoicesPage /> },
      { path: 'invoices', element: <InvoicesPage /> },
      { path: 'returns', element: <ReturnsPage /> },
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'users', element: <UsersPage /> }
    ]
  }
]);
