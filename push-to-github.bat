@echo off
setlocal
echo ========================================================
echo  Enviando alteracoes para https://github.com/welingtondev/semin-50-mineracao
echo ========================================================

where git >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" (
        set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"
    )
)

git push origin main

echo.
echo Concluido!
pause
