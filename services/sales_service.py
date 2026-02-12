from datetime import datetime
from database.db import get_connection
from services.pdf_service import PDFService


class SalesService:
    @staticmethod
    def create_sale(customer_name: str, discount: float, cart_items: list[dict]):
        if not cart_items:
            raise ValueError("Cart is empty")

        now = datetime.now()
        invoice_no = f"SI-{now.strftime('%Y%m%d%H%M%S')}"
        total_before_discount = sum(i["line_total"] for i in cart_items)
        total_after_discount = max(total_before_discount - float(discount), 0)

        with get_connection() as conn:
            cursor = conn.cursor()

            for i in cart_items:
                stock = cursor.execute("SELECT quantity FROM items WHERE id=?", (i["item_id"],)).fetchone()
                if stock is None:
                    raise ValueError(f"Item not found: {i['item_name']}")
                if stock["quantity"] < i["quantity"]:
                    raise ValueError(f"Insufficient stock for: {i['item_name']}")

            cursor.execute(
                """
                INSERT INTO sales_invoices (invoice_no, customer_name, discount, total_before_discount, total_after_discount, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    invoice_no,
                    customer_name.strip(),
                    float(discount),
                    float(total_before_discount),
                    float(total_after_discount),
                    now.strftime("%Y-%m-%d %H:%M:%S"),
                ),
            )
            invoice_id = cursor.lastrowid

            for i in cart_items:
                cursor.execute(
                    """
                    INSERT INTO sales_invoice_items (invoice_id, item_id, item_name, quantity, unit_price, line_total)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (invoice_id, i["item_id"], i["item_name"], i["quantity"], i["unit_price"], i["line_total"]),
                )
                cursor.execute(
                    "UPDATE items SET quantity = quantity - ? WHERE id=?",
                    (i["quantity"], i["item_id"]),
                )

            conn.commit()

        invoice = {
            "invoice_no": invoice_no,
            "customer_name": customer_name,
            "discount": float(discount),
            "total_before_discount": float(total_before_discount),
            "total_after_discount": float(total_after_discount),
            "created_at": now.strftime("%Y-%m-%d %H:%M:%S"),
        }
        pdf_path = PDFService.generate_sales_invoice_pdf(invoice, cart_items)
        return invoice, pdf_path
