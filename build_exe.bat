@echo off
python -m PyInstaller --noconfirm --onefile --windowed --name StoreManager main.py
echo Build completed. EXE is in dist\StoreManager.exe
pause
