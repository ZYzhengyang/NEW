@echo off
chcp 65001 > nul
title HuaXian项目启动工具

echo 正在启动HuaXian项目...
echo 当前目录：%CD%

:: 检查目录是否存在
echo 检查目标路径：H:\网站代码\HuaXian源码\light-actorcore
if not exist "H:\网站代码\HuaXian源码\light-actorcore" (
    echo 错误：找不到目录 H:\网站代码\HuaXian源码\light-actorcore
    goto :error
)

:: 切换到项目目录
echo 切换到项目目录...
cd /d "H:\网站代码\HuaXian源码\light-actorcore"
echo 切换后当前目录：%CD%

:: 检查后端目录
echo 检查后端目录...
if not exist "backend" (
    echo 错误：找不到后端目录
    goto :error
)

:: 检查前端目录
echo 检查前端目录...
if not exist "frontend" (
    echo 错误：找不到前端目录
    goto :error
)

:: 启动后端 (.NET应用)
echo 启动后端应用...
start "后端服务" cmd /c "cd backend && echo 启动后端服务... && dotnet run"

:: 启动前端 (Node.js应用)
echo 启动前端应用...
start "前端服务" cmd /c "cd frontend && echo 启动前端服务... && npm run dev"

echo.
echo 项目启动完成！
echo 后端和前端已在单独的命令行窗口中运行
echo 关闭相应窗口可停止服务
goto :end

:error
echo.
echo 启动失败！请检查路径和文件是否存在。
echo.

:end
pause 