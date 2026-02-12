# قالب فاتورة PDF عربي

يتم توليد فاتورة PDF من المسار:
- `GET /api/invoices/:id/pdf`

المحتوى:
- عنوان فاتورة مبيعات
- رقم الفاتورة
- اسم العميل
- بنود الفاتورة (الصنف / الكمية / السعر)
- الإجمالي

يمكن تعديل التنسيق في:
- `backend/src/controllers/modulesController.js` داخل الدالة `exportInvoicePdf`.
