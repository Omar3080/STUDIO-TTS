from database.db import get_connection


class InventoryService:
    @staticmethod
    def get_all_items():
        with get_connection() as conn:
            rows = conn.execute("SELECT * FROM items ORDER BY id DESC").fetchall()
            return [dict(r) for r in rows]

    @staticmethod
    def add_item(name: str, code: str, buy_price: float, sell_price: float, quantity: int):
        with get_connection() as conn:
            conn.execute(
                """
                INSERT INTO items (name, code, buy_price, sell_price, quantity)
                VALUES (?, ?, ?, ?, ?)
                """,
                (name.strip(), code.strip(), float(buy_price), float(sell_price), int(quantity)),
            )
            conn.commit()

    @staticmethod
    def update_item(item_id: int, name: str, code: str, buy_price: float, sell_price: float, quantity: int):
        with get_connection() as conn:
            conn.execute(
                """
                UPDATE items
                SET name=?, code=?, buy_price=?, sell_price=?, quantity=?
                WHERE id=?
                """,
                (name.strip(), code.strip(), float(buy_price), float(sell_price), int(quantity), item_id),
            )
            conn.commit()

    @staticmethod
    def delete_item(item_id: int):
        with get_connection() as conn:
            conn.execute("DELETE FROM items WHERE id=?", (item_id,))
            conn.commit()

    @staticmethod
    def adjust_stock(item_id: int, qty_change: int):
        with get_connection() as conn:
            conn.execute(
                "UPDATE items SET quantity = quantity + ? WHERE id=?",
                (qty_change, item_id),
            )
            conn.commit()
