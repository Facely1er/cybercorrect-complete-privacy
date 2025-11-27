@echo off
REM Batch script to fix cybercorrect remote repository link

echo ========================================
echo Fix CyberCorrect Remote Repository Link
echo ========================================
echo.

REM Check if git is available
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not found in PATH
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

REM Change to repository directory
cd /d "%~dp0.."

echo Repository: %CD%
echo.

REM Show current remote
echo Current remote configuration:
git remote -v
echo.

REM Options menu
echo Select an option:
echo 1. Use default HTTPS: https://github.com/cybercorrect/cybercorrect-complete-privacy.git
echo 2. Use SSH: git@github.com:cybercorrect/cybercorrect-complete-privacy.git
echo 3. Enter custom repository URL
echo 4. Test current remote connection
echo 5. Remove and re-add remote
echo.

set /p choice="Enter choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo Setting remote to HTTPS...
    git remote set-url origin https://github.com/cybercorrect/cybercorrect-complete-privacy.git
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Remote URL updated successfully
    ) else (
        echo ❌ Failed to update remote URL
        pause
        exit /b 1
    )
) else if "%choice%"=="2" (
    echo.
    echo Setting remote to SSH...
    git remote set-url origin git@github.com:cybercorrect/cybercorrect-complete-privacy.git
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Remote URL updated successfully
    ) else (
        echo ❌ Failed to update remote URL
        pause
        exit /b 1
    )
) else if "%choice%"=="3" (
    echo.
    echo Enter the repository URL:
    echo Examples:
    echo   HTTPS: https://github.com/username/repo.git
    echo   SSH:   git@github.com:username/repo.git
    echo.
    set /p newUrl="Repository URL: "
    
    if "%newUrl%"=="" (
        echo ❌ No URL provided. Exiting.
        pause
        exit /b 1
    )
    
    echo.
    echo Setting remote to custom URL...
    git remote set-url origin "%newUrl%"
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Remote URL updated successfully
    ) else (
        echo ❌ Failed to update remote URL
        pause
        exit /b 1
    )
) else if "%choice%"=="4" (
    echo.
    echo Testing remote connection...
    git fetch origin --dry-run
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Remote connection successful!
    ) else (
        echo ❌ Remote connection failed
        echo.
        echo Possible issues:
        echo   - Repository doesn't exist at this URL
        echo   - Authentication required
        echo   - Network connectivity issues
    )
    pause
    exit /b 0
) else if "%choice%"=="5" (
    echo.
    echo Removing existing remote...
    git remote remove origin
    
    echo.
    set /p newUrl="Enter the repository URL: "
    
    if "%newUrl%"=="" (
        echo ❌ No URL provided. Exiting.
        pause
        exit /b 1
    )
    
    echo.
    echo Adding new remote...
    git remote add origin "%newUrl%"
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Remote added successfully
    ) else (
        echo ❌ Failed to add remote
        pause
        exit /b 1
    )
) else (
    echo ❌ Invalid choice. Exiting.
    pause
    exit /b 1
)

REM Verify the change
echo.
echo ========================================
echo Updated remote configuration:
echo ========================================
git remote -v
echo.

REM Update branch tracking
echo Updating branch tracking...
for /f "tokens=*" %%i in ('git branch --show-current') do set currentBranch=%%i
git branch --set-upstream-to=origin/%currentBranch% %currentBranch%
echo ✅ Branch tracking updated
echo.

echo ========================================
echo ✅ Remote repository link fixed!
echo ========================================
echo.
echo Next steps:
echo   - Test connection: git fetch origin
echo   - Pull changes: git pull origin main
echo   - Push changes: git push origin main
echo.

pause

