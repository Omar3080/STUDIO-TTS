from database.db import init_db
from ui.app import StoreApp


if __name__ == "__main__":
    init_db()
    app = StoreApp()
    app.mainloop()
