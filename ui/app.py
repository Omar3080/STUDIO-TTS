import tkinter as tk
from tkinter import ttk, messagebox

from services.auth_service import AuthService
from services.inventory_service import InventoryService
from services.sales_service import SalesService
from services.purchase_service import PurchaseService
from services.report_service import ReportService


BG = "#f6f8fb"
PRIMARY = "#2563eb"


class StoreApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Store Manager")
        self.geometry("1200x730")
        self.configure(bg=BG)

        self.current_user = None
        self._build_style()
        self.show_login_screen()

    def _build_style(self):
        style = ttk.Style()
        style.theme_use("clam")
        style.configure("TFrame", background=BG)
        style.configure("TLabel", background=BG)
        style.configure("Header.TLabel", font=("Segoe UI", 18, "bold"), foreground=PRIMARY)
        style.configure("TButton", font=("Segoe UI", 10))
        style.configure("Treeview", rowheight=24, font=("Segoe UI", 10))
        style.configure("Treeview.Heading", font=("Segoe UI", 10, "bold"))

    def clear_root(self):
        for w in self.winfo_children():
            w.destroy()

    def show_login_screen(self):
        self.clear_root()
        frame = ttk.Frame(self, padding=30)
        frame.pack(expand=True)

        ttk.Label(frame, text="تسجيل دخول - Store Manager", style="Header.TLabel").grid(row=0, column=0, columnspan=2, pady=20)

        ttk.Label(frame, text="اسم المستخدم").grid(row=1, column=0, sticky="e", pady=10)
        username = ttk.Entry(frame, width=30)
        username.grid(row=1, column=1)

        ttk.Label(frame, text="كلمة المرور").grid(row=2, column=0, sticky="e", pady=10)
        password = ttk.Entry(frame, width=30, show="*")
        password.grid(row=2, column=1)

        def do_login():
            user = AuthService.login(username.get(), password.get())
            if not user:
                messagebox.showerror("خطأ", "بيانات دخول غير صحيحة")
                return
            self.current_user = user
            self.show_main_screen()

        ttk.Button(frame, text="دخول", command=do_login).grid(row=3, column=0, columnspan=2, pady=16)
        ttk.Label(frame, text="admin/admin123 أو user/user123").grid(row=4, column=0, columnspan=2)

    def show_main_screen(self):
        self.clear_root()
        root_frame = ttk.Frame(self, padding=16)
        root_frame.pack(fill="both", expand=True)

        top = ttk.Frame(root_frame)
        top.pack(fill="x")
        ttk.Label(top, text=f"مرحبًا {self.current_user['username']} ({self.current_user['role']})", style="Header.TLabel").pack(side="left")
        ttk.Button(top, text="تسجيل الخروج", command=self.show_login_screen).pack(side="right")

        notebook = ttk.Notebook(root_frame)
        notebook.pack(fill="both", expand=True, pady=12)

        inventory_tab = ttk.Frame(notebook, padding=10)
        sales_tab = ttk.Frame(notebook, padding=10)
        purchase_tab = ttk.Frame(notebook, padding=10)
        reports_tab = ttk.Frame(notebook, padding=10)

        notebook.add(inventory_tab, text="الأصناف")
        notebook.add(sales_tab, text="فواتير بيع")
        notebook.add(purchase_tab, text="فواتير شراء")
        notebook.add(reports_tab, text="تقارير")

        self.build_inventory_tab(inventory_tab)
        self.build_sales_tab(sales_tab)
        self.build_purchase_tab(purchase_tab)
        self.build_reports_tab(reports_tab)

    def build_inventory_tab(self, parent):
        if self.current_user["role"] != "Admin":
            ttk.Label(parent, text="صلاحية الأدمن مطلوبة لإدارة الأصناف").pack(pady=30)
            return

        form = ttk.Frame(parent)
        form.pack(fill="x", pady=8)

        fields = ["name", "code", "buy_price", "sell_price", "quantity"]
        labels = {
            "name": "اسم الصنف",
            "code": "الكود",
            "buy_price": "سعر الشراء",
            "sell_price": "سعر البيع",
            "quantity": "الكمية",
        }
        entries = {}
        for idx, f in enumerate(fields):
            ttk.Label(form, text=labels[f]).grid(row=0, column=idx, padx=4)
            ent = ttk.Entry(form, width=18)
            ent.grid(row=1, column=idx, padx=4)
            entries[f] = ent

        columns = ("id", "name", "code", "buy_price", "sell_price", "quantity")
        tree = ttk.Treeview(parent, columns=columns, show="headings", height=18)
        for c in columns:
            tree.heading(c, text=c)
            tree.column(c, width=110)
        tree.pack(fill="both", expand=True, pady=12)

        selected_id = {"id": None}

        def refresh():
            for row in tree.get_children():
                tree.delete(row)
            for item in InventoryService.get_all_items():
                tree.insert("", "end", values=(item["id"], item["name"], item["code"], item["buy_price"], item["sell_price"], item["quantity"]))

        def clear_form():
            selected_id["id"] = None
            for f in fields:
                entries[f].delete(0, tk.END)

        def add_item():
            try:
                InventoryService.add_item(
                    entries["name"].get(),
                    entries["code"].get(),
                    float(entries["buy_price"].get()),
                    float(entries["sell_price"].get()),
                    int(entries["quantity"].get()),
                )
                refresh()
                clear_form()
            except Exception as e:
                messagebox.showerror("خطأ", str(e))

        def update_item():
            if not selected_id["id"]:
                messagebox.showwarning("تنبيه", "اختر صنف للتعديل")
                return
            try:
                InventoryService.update_item(
                    selected_id["id"],
                    entries["name"].get(),
                    entries["code"].get(),
                    float(entries["buy_price"].get()),
                    float(entries["sell_price"].get()),
                    int(entries["quantity"].get()),
                )
                refresh()
            except Exception as e:
                messagebox.showerror("خطأ", str(e))

        def delete_item():
            if not selected_id["id"]:
                messagebox.showwarning("تنبيه", "اختر صنف للحذف")
                return
            try:
                InventoryService.delete_item(selected_id["id"])
                refresh()
                clear_form()
            except Exception as e:
                messagebox.showerror("خطأ", str(e))

        def on_select(_):
            selection = tree.selection()
            if not selection:
                return
            values = tree.item(selection[0], "values")
            selected_id["id"] = int(values[0])
            entries["name"].delete(0, tk.END)
            entries["name"].insert(0, values[1])
            entries["code"].delete(0, tk.END)
            entries["code"].insert(0, values[2])
            entries["buy_price"].delete(0, tk.END)
            entries["buy_price"].insert(0, values[3])
            entries["sell_price"].delete(0, tk.END)
            entries["sell_price"].insert(0, values[4])
            entries["quantity"].delete(0, tk.END)
            entries["quantity"].insert(0, values[5])

        tree.bind("<<TreeviewSelect>>", on_select)

        actions = ttk.Frame(parent)
        actions.pack(fill="x")
        ttk.Button(actions, text="إضافة", command=add_item).pack(side="left", padx=4)
        ttk.Button(actions, text="تعديل", command=update_item).pack(side="left", padx=4)
        ttk.Button(actions, text="حذف", command=delete_item).pack(side="left", padx=4)
        ttk.Button(actions, text="مسح", command=clear_form).pack(side="left", padx=4)

        refresh()

    def _build_invoice_ui(self, parent, mode="sale"):
        title = "عميل" if mode == "sale" else "مورد"
        discount_enabled = mode == "sale"

        top = ttk.Frame(parent)
        top.pack(fill="x", pady=6)

        ttk.Label(top, text=title).grid(row=0, column=0, padx=4)
        party_entry = ttk.Entry(top, width=22)
        party_entry.grid(row=0, column=1, padx=4)

        ttk.Label(top, text="الصنف").grid(row=0, column=2, padx=4)
        item_combo = ttk.Combobox(top, width=30, state="readonly")
        item_combo.grid(row=0, column=3, padx=4)

        ttk.Label(top, text="كمية").grid(row=0, column=4, padx=4)
        qty_entry = ttk.Entry(top, width=10)
        qty_entry.grid(row=0, column=5, padx=4)

        if discount_enabled:
            ttk.Label(top, text="خصم").grid(row=0, column=6, padx=4)
            discount_entry = ttk.Entry(top, width=10)
            discount_entry.insert(0, "0")
            discount_entry.grid(row=0, column=7, padx=4)
        else:
            discount_entry = None

        columns = ("item_id", "item_name", "qty", "unit_price", "line_total")
        tree = ttk.Treeview(parent, columns=columns, show="headings", height=15)
        for c in columns:
            tree.heading(c, text=c)
            tree.column(c, width=140)
        tree.pack(fill="both", expand=True, pady=10)

        total_var = tk.StringVar(value="0.00")
        ttk.Label(parent, textvariable=total_var, style="Header.TLabel").pack(anchor="w")

        items = InventoryService.get_all_items()
        options = [f"{i['id']} - {i['name']} ({i['code']})" for i in items]
        item_combo["values"] = options

        cart = []

        def recalc_total():
            total_var.set(f"الإجمالي: {sum(x['line_total'] for x in cart):.2f}")

        def add_to_cart():
            try:
                if not item_combo.get():
                    raise ValueError("اختر صنف")
                item_id = int(item_combo.get().split(" - ")[0])
                qty = int(qty_entry.get())
                if qty <= 0:
                    raise ValueError("الكمية يجب أن تكون أكبر من صفر")
                item = next(i for i in items if i["id"] == item_id)
                unit_price = item["sell_price"] if mode == "sale" else item["buy_price"]
                line = {
                    "item_id": item_id,
                    "item_name": item["name"],
                    "quantity": qty,
                    "unit_price": float(unit_price),
                    "line_total": float(unit_price) * qty,
                }
                cart.append(line)
                tree.insert("", "end", values=(line["item_id"], line["item_name"], line["quantity"], line["unit_price"], line["line_total"]))
                recalc_total()
            except Exception as e:
                messagebox.showerror("خطأ", str(e))

        def save_invoice():
            try:
                if mode == "sale":
                    discount = float(discount_entry.get() if discount_entry else 0)
                    invoice, pdf_path = SalesService.create_sale(party_entry.get(), discount, cart)
                    messagebox.showinfo("تم", f"تم حفظ فاتورة {invoice['invoice_no']}\nPDF: {pdf_path}")
                else:
                    invoice = PurchaseService.create_purchase(party_entry.get(), cart)
                    messagebox.showinfo("تم", f"تم حفظ فاتورة {invoice['invoice_no']}")

                for row in tree.get_children():
                    tree.delete(row)
                cart.clear()
                recalc_total()
            except Exception as e:
                messagebox.showerror("خطأ", str(e))

        actions = ttk.Frame(parent)
        actions.pack(fill="x", pady=6)
        ttk.Button(actions, text="إضافة للفاتورة", command=add_to_cart).pack(side="left", padx=4)
        ttk.Button(actions, text="حفظ الفاتورة", command=save_invoice).pack(side="left", padx=4)

    def build_sales_tab(self, parent):
        self._build_invoice_ui(parent, mode="sale")

    def build_purchase_tab(self, parent):
        if self.current_user["role"] != "Admin":
            ttk.Label(parent, text="صلاحية الأدمن مطلوبة لفواتير الشراء").pack(pady=30)
            return
        self._build_invoice_ui(parent, mode="purchase")

    def build_reports_tab(self, parent):
        top = ttk.Frame(parent)
        top.pack(fill="x", pady=8)

        ttk.Label(top, text="الشهر (YYYY-MM)").grid(row=0, column=0, padx=4)
        month_entry = ttk.Entry(top, width=16)
        month_entry.grid(row=0, column=1, padx=4)

        profit_var = tk.StringVar(value="الربح الشهري: 0.00")
        ttk.Label(parent, textvariable=profit_var, style="Header.TLabel").pack(anchor="w", pady=6)

        cols = ("item_name", "total_qty")
        tree = ttk.Treeview(parent, columns=cols, show="headings", height=18)
        tree.heading("item_name", text="الصنف")
        tree.heading("total_qty", text="إجمالي المبيعات")
        tree.column("item_name", width=260)
        tree.column("total_qty", width=170)
        tree.pack(fill="both", expand=True)

        def run_reports():
            month = month_entry.get().strip()
            if month:
                profit = ReportService.monthly_profit(month)
                profit_var.set(f"الربح الشهري: {profit:.2f}")
            for row in tree.get_children():
                tree.delete(row)
            for item in ReportService.best_selling_items(20):
                tree.insert("", "end", values=(item["item_name"], item["total_qty"]))

        ttk.Button(top, text="تحديث التقارير", command=run_reports).grid(row=0, column=2, padx=4)
        run_reports()
