@echo off
chcp 65001 >$null
REM ============================================================
REM  vision-plus 增强补丁安装脚本
REM  在 DeepSeek Harness 仓库根目录执行本脚本（或把本脚本放到根目录执行）：
REM  应用插件 patches\ 下的全部增强补丁，并重建宿主。
REM  纯官方版不用执行——插件基础功能不需要补丁。
REM ============================================================
set "ROOT=%~dp0"

echo [1/2] 应用增强补丁...
for %%p in ("%ROOT%*.patch") do (
  echo   %%~nxp
  git apply "%%p" 2>$null
  if errorlevel 1 echo   [提示] %%~nxp 未应用（可能已应用过或版本不匹配）
)

echo [2/2] 重建宿主（首次较慢）...
call pnpm run build
if errorlevel 1 (
  echo   [警告] 构建失败：可能是补丁与新版本冲突，请检查后重试
) else (
  echo   构建完成
)

echo.
echo 完成。重启 Harness 生效。
pause