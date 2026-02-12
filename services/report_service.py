from database.db import get_connection


class ReportService:
    @staticmethod
    def monthly_profit(month: str):
        with get_connection() as conn:
            row = conn.execute(
                """
                SELECT
                    COALESCE(SUM(sii.line_total - (sii.quantity * i.buy_price)), 0) AS profit
                FROM sales_invoice_items sii
                JOIN sales_invoices si ON si.id = sii.invoice_id
                JOIN items i ON i.id = sii.item_id
                WHERE strftime('%Y-%m', si.created_at) = ?
                """,
                (month,),
            ).fetchone()
            return float(row["profit"])

    @staticmethod
    def best_selling_items(limit: int = 10):
        with get_connection() as conn:
            rows = conn.execute(
                """
                SELECT item_name, SUM(quantity) AS total_qty
                FROM sales_invoice_items
                GROUP BY item_name
                ORDER BY total_qty DESC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()
            return [dict(r) for r in rows]
