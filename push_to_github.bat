@echo off
echo ===================================================
echo Pushing Smart Study Assistant to GitHub
echo Repo: https://github.com/divdivyesh932-blip/AI-BASED-SMART-STUDY.git
echo ===================================================
echo.
cd /d "d:\New folder"
"d:\mingit\cmd\git.exe" push -u origin main
echo.
if %errorlevel% equ 0 (
    echo [SUCCESS] Code pushed successfully to GitHub!
) else (
    echo [NOTE] If prompted, please enter your GitHub Personal Access Token (PAT) as the password.
)
pause
