@echo off
chcp 65001 >$null
node "%~dp0uninstall.mjs"
exit /b %ERRORLEVEL%