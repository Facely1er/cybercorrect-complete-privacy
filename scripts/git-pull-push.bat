@echo off
REM Batch script to pull and push cybercorrect-complete-privacy repository

echo ========================================
echo Syncing CyberCorrect Repository
echo ========================================
echo.

REM Change to repository directory
cd /d "%~dp0.."

REM Check if git is available
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not found in PATH
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo Or add Git to your PATH environment variable
    echo.
    echo Common Git installation paths:
    echo   C:\Program Files\Git\bin\git.exe
    echo   C:\Program Files (x86)\Git\bin\git.exe
    echo.
    pause
    exit /b 1
)

echo Git found!
echo.
echo Repository: %CD%
echo.

REM Check status
echo Checking repository status...
git status --short
echo.

REM Pull latest changes
echo ========================================
echo PULLING LATEST CHANGES
echo ========================================
echo.
git pull origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: Pull failed. You may need to resolve conflicts.
    echo.
    set /p continue="Continue with push anyway? (y/n): "
    if /i not "%continue%"=="y" (
        echo Aborted.
        pause
        exit /b 1
    )
)
echo.

REM Push changes
echo ========================================
echo PUSHING CHANGES
echo ========================================
echo.
git push origin main
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SYNC COMPLETE
    echo ========================================
    echo.
    echo Repository is now in sync with remote!
) else (
    echo.
    echo ========================================
    echo SYNC INCOMPLETE
    echo ========================================
    echo.
    echo Please check the errors above and try again.
)

echo.
pause

