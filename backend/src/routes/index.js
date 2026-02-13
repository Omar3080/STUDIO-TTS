import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema } from '../validations/authValidation.js';
import { customerSchema } from '../validations/customerValidation.js';
import { productSchema } from '../validations/productValidation.js';
import * as authController from '../controllers/authController.js';
import * as customersController from '../controllers/customersController.js';
import * as productsController from '../controllers/productsController.js';
import * as invoicesController from '../controllers/invoicesController.js';
import * as returnsController from '../controllers/returnsController.js';
import * as paymentsController from '../controllers/paymentsController.js';
import * as reportsController from '../controllers/reportsController.js';
import * as settingsController from '../controllers/settingsController.js';
import * as usersController from '../controllers/usersController.js';

const router = Router();
router.post('/auth/login', validate(loginSchema), authController.login);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/logout', authController.logout);

router.use(auth);
router.get('/users', usersController.listUsers);
router.post('/users', usersController.createUser);

router.get('/customers', customersController.listCustomers);
router.post('/customers', validate(customerSchema), customersController.createCustomer);
router.put('/customers/:id', customersController.updateCustomer);
router.delete('/customers/:id', customersController.deleteCustomer);

router.get('/products', productsController.listProducts);
router.post('/products', validate(productSchema), productsController.createProduct);
router.put('/products/:id', productsController.updateProduct);
router.delete('/products/:id', productsController.deleteProduct);
router.get('/products/export/excel', productsController.exportProducts);

router.get('/invoices', invoicesController.listInvoices);
router.post('/invoices', invoicesController.createInvoice);
router.post('/invoices/:id/post', invoicesController.postInvoice);
router.get('/invoices/:id/pdf', invoicesController.invoicePdf);

router.get('/returns', returnsController.listReturns);
router.post('/returns', returnsController.createReturn);
router.post('/returns/:id/post', returnsController.postReturn);

router.get('/payments', paymentsController.listPayments);
router.post('/payments', paymentsController.createPayment);

router.get('/reports/dashboard', reportsController.dashboard);
router.get('/reports/customers-balance', reportsController.customerBalances);
router.get('/reports/unpaid-invoices', reportsController.unpaidInvoices);
router.get('/reports/inventory', reportsController.inventoryReport);

router.get('/settings', settingsController.getSettings);
router.put('/settings', settingsController.updateSettings);

export default router;
