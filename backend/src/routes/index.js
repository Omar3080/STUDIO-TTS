import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { login, logout, refresh } from '../controllers/authController.js';
import {
  createCustomer, createInvoice, createPayment, createProduct, createReturn, dashboard, deleteCustomer,
  deleteProduct, exportInvoicePdf, exportSalesExcel, getSettings, listCustomers, listInvoices, listPayments,
  listProducts, listUsers, listAuditLogs, postInvoice, postReturn, salesReport, updateCustomer, updateProduct, updateSettings, createUser
} from '../controllers/modulesController.js';

const router = Router();

router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);

router.use(authenticate);
router.get('/dashboard', dashboard);

router.route('/customers').get(listCustomers).post(createCustomer);
router.route('/customers/:id').patch(updateCustomer).delete(deleteCustomer);

router.route('/products').get(listProducts).post(createProduct);
router.route('/products/:id').patch(updateProduct).delete(deleteProduct);

router.route('/invoices').get(listInvoices).post(createInvoice);
router.post('/invoices/:id/post', postInvoice);
router.get('/invoices/:id/pdf', exportInvoicePdf);

router.post('/returns', createReturn);
router.post('/returns/:id/post', postReturn);

router.route('/payments').get(listPayments).post(createPayment);

router.get('/reports/sales', salesReport);
router.get('/reports/sales/excel', exportSalesExcel);

router.route('/settings').get(getSettings).patch(updateSettings);
router.route('/users').get(listUsers).post(createUser);
router.get('/audit-logs', listAuditLogs);

export default router;
