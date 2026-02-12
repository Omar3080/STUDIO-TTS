import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "store.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        cursor = conn.cursor()

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('Admin', 'User'))
            )
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                code TEXT UNIQUE NOT NULL,
                buy_price REAL NOT NULL,
                sell_price REAL NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 0
            )
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS sales_invoices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_no TEXT UNIQUE NOT NULL,
                customer_name TEXT,
                discount REAL NOT NULL DEFAULT 0,
                total_before_discount REAL NOT NULL,
                total_after_discount REAL NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS sales_invoice_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_id INTEGER NOT NULL,
                item_id INTEGER NOT NULL,
                item_name TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                unit_price REAL NOT NULL,
                line_total REAL NOT NULL,
                FOREIGN KEY(invoice_id) REFERENCES sales_invoices(id)
            )
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS purchase_invoices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_no TEXT UNIQUE NOT NULL,
                supplier_name TEXT,
                total REAL NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS purchase_invoice_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_id INTEGER NOT NULL,
                item_id INTEGER NOT NULL,
                item_name TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                unit_price REAL NOT NULL,
                line_total REAL NOT NULL,
                FOREIGN KEY(invoice_id) REFERENCES purchase_invoices(id)
            )
            """
        )

        cursor.execute("SELECT COUNT(*) AS cnt FROM users")
        users_count = cursor.fetchone()["cnt"]
        if users_count == 0:
            cursor.executemany(
                "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
                [
                    ("admin", "admin123", "Admin"),
                    ("user", "user123", "User"),
                ],
            )

        conn.commit()
