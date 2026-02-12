from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


class PDFService:
    @staticmethod
    def generate_sales_invoice_pdf(invoice: dict, invoice_items: list[dict]) -> str:
        invoices_dir = Path("invoices")
        invoices_dir.mkdir(exist_ok=True)

        output_path = invoices_dir / f"{invoice['invoice_no']}.pdf"
        c = canvas.Canvas(str(output_path), pagesize=A4)
        width, height = A4

        y = height - 50
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, y, "Sales Invoice")

        y -= 30
        c.setFont("Helvetica", 11)
        c.drawString(50, y, f"Invoice No: {invoice['invoice_no']}")
        y -= 20
        c.drawString(50, y, f"Date: {invoice['created_at']}")
        y -= 20
        c.drawString(50, y, f"Customer: {invoice.get('customer_name') or '-'}")

        y -= 35
        c.setFont("Helvetica-Bold", 11)
        c.drawString(50, y, "Item")
        c.drawString(260, y, "Qty")
        c.drawString(320, y, "Price")
        c.drawString(410, y, "Total")

        y -= 15
        c.line(50, y, 540, y)
        y -= 20

        c.setFont("Helvetica", 10)
        for item in invoice_items:
            c.drawString(50, y, item["item_name"])
            c.drawString(260, y, str(item["quantity"]))
            c.drawString(320, y, f"{item['unit_price']:.2f}")
            c.drawString(410, y, f"{item['line_total']:.2f}")
            y -= 20
            if y < 120:
                c.showPage()
                y = height - 50

        y -= 10
        c.line(50, y, 540, y)
        y -= 25
        c.setFont("Helvetica-Bold", 11)
        c.drawString(50, y, f"Subtotal: {invoice['total_before_discount']:.2f}")
        y -= 20
        c.drawString(50, y, f"Discount: {invoice['discount']:.2f}")
        y -= 20
        c.drawString(50, y, f"Grand Total: {invoice['total_after_discount']:.2f}")

        c.save()
        return str(output_path)
