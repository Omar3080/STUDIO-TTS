from database.db import get_connection


class AuthService:
    @staticmethod
    def login(username: str, password: str):
        with get_connection() as conn:
            row = conn.execute(
                "SELECT id, username, role FROM users WHERE username=? AND password=?",
                (username.strip(), password.strip()),
            ).fetchone()
            return dict(row) if row else None
