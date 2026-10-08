@echo off
rem Mo cong cu chuan bi dang ban Viet hoa (NH Viet Hoa)
cd /d "%~dp0"
set PY=
where py >nul 2>nul && set PY=py
if "%PY%"=="" where python >nul 2>nul && set PY=python
if "%PY%"=="" (
  echo Chua cai Python. Tai tai https://www.python.org/downloads/ ^(nho tick "Add python.exe to PATH"^), roi chay lai file nay.
  pause
  exit /b 1
)
%PY% -c "import PIL" >nul 2>nul || (
  echo Dang cai thu vien xu ly anh Pillow ^(chi lan dau^)...
  %PY% -m pip install --user pillow
)
start "" %PY%w dang_ban.pyw 2>nul || %PY% dang_ban.pyw
