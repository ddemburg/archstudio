@echo off
set /p KEY="Paste your Supabase anon key and press Enter: "
powershell -Command "(Get-Content 'index.html') -replace 'PASTE_YOUR_ANON_KEY_HERE', '%KEY%' | Set-Content 'index.html'"
echo Done!
pause
