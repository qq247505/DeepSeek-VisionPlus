@echo off
chcp 65001 >$null
node "%~dp0enhance.mjs"
exit /b %ERRORLEVEL%