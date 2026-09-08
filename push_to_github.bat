@echo off
set "PATH=%PATH%;d:\mingit\cmd;d:\mingit\mingw64\bin"
echo ===================================================
echo Pushing Smart Study Assistant to GitHub
echo Repo: https://github.com/divdivyesh932-blip/AI-BASED-SMART-STUDY.git
echo ===================================================
echo.
cd /d "d:\New folder"

git config credential.helper "d:/mingit/mingw64/bin/git-credential-manager.exe"
git config credential.credentialStore "wincredman"

echo Connecting to GitHub...
git push -u origin main

echo.
if %errorlevel% equ 0 (
    echo ===================================================
    echo [SUCCESS] Code pushed successfully to GitHub!
    echo Refresh your repository page:
    echo https://github.com/divdivyesh932-blip/AI-BASED-SMART-STUDY
    echo ===================================================
) else (
    echo [ERROR] Push failed or was cancelled. Error code: %errorlevel%
)
pause
