# Store Manager (Windows 11)

برنامج إدارة مخزن كامل باستخدام:
- **Python 3.11+**
- **Tkinter** (واجهة المستخدم)
- **SQLite** (قاعدة البيانات المحلية)

## المزايا المطلوبة
- شاشة تسجيل دخول (Admin/User).
- إدارة الأصناف: إضافة / تعديل / حذف (اسم - كود - سعر شراء - سعر بيع - كمية).
- فواتير بيع: اختيار صنف + كمية + خصم + توليد فاتورة PDF.
- فواتير شراء: إضافة أصناف للمخزن.
- تقارير: أرباح شهرية + أكثر الأصناف مبيعًا.
- تصميم UI بسيط وحديث باستخدام `ttk`.
- دعم توليد ملف EXE عبر PyInstaller.
- هيكلة مرتبة: `ui`, `database`, `services`.

## هيكل المشروع

```text
STUDIO-TTS/
├─ main.py
├─ store.db                 # يتولد تلقائيًا عند أول تشغيل
├─ requirements.txt
├─ build_exe.bat
├─ README.md
├─ database/
│  ├─ __init__.py
│  └─ db.py
├─ services/
│  ├─ __init__.py
│  ├─ auth_service.py
│  ├─ inventory_service.py
│  ├─ purchase_service.py
│  ├─ sales_service.py
│  ├─ report_service.py
│  └─ pdf_service.py
└─ ui/
   ├─ __init__.py
   └─ app.py
```

## التشغيل (Development)

1) تثبيت المتطلبات:
```bash
pip install -r requirements.txt
```

2) تشغيل البرنامج:
```bash
python main.py
```

## بيانات الدخول الافتراضية
- **Admin**
  - username: `admin`
  - password: `admin123`
- **User**
  - username: `user`
  - password: `user123`

## بناء ملف EXE على ويندوز 11

### الطريقة السريعة
شغّل:
```bat
build_exe.bat
```

### الطريقة اليدوية
```bash
python -m PyInstaller --noconfirm --onefile --windowed --name StoreManager main.py
```

بعد الانتهاء ستجد الملف التنفيذي في:
```text
dist/StoreManager.exe
```

## ملاحظات
- يتم حفظ الفواتير PDF داخل مجلد `invoices/`.
- قاعدة البيانات `store.db` محلية بجانب المشروع.
- إذا ظهرت مشكلة خطوط عربية في PDF يمكنك تغيير الخط داخل `services/pdf_service.py`.
