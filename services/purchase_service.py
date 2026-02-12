from datetime import datetime
from database.db import get_connection


class PurchaseService:
    @staticmethod
    def create_purchase(supplier_name: str, cart_items: list[dict]):
        if not cart_items:
            raise ValueError("Purchase cart is empty")

        now = datetime.now()
        invoice_no = f"PI-{now.strftime('%Y%m%d%H%M%S')}"
        total = sum(i["line_total"] for i in cart_items)

        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO purchase_invoices (invoice_no, supplier_name, total, created_at)
                VALUES (?, ?, ?, ?)
                """,
                (invoice_no, supplier_name.strip(), float(total), now.strftime("%Y-%m-%d %H:%M:%S")),
            )
            invoice_id = cursor.lastrowid

            for i in cart_items:
                cursor.execute(
                    """
                    INSERT INTO purchase_invoice_items (invoice_id, item_id, item_name, quantity, unit_price, line_total)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (invoice_id, i["item_id"], i["item_name"], i["quantity"], i["unit_price"], i["line_total"]),
                )
                cursor.execute(
                    "UPDATE items SET quantity = quantity + ? WHERE id=?",
                    (i["quantity"], i["item_id"]),
                )

            conn.commit()

        return {
            "invoice_no": invoice_no,
            "supplier_name": supplier_name,
            "total": float(total),
            "created_at": now.strftime("%Y-%m-%d %H:%M:%S"),
        }
