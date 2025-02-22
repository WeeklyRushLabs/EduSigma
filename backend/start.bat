@echo off

echo Checking for processes on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /F /PID %%a

echo Cleaning up MongoDB files...
if exist "data\db\mongod.lock" del /f "data\db\mongod.lock"
if exist "data\db\WiredTiger.lock" del /f "data\db\WiredTiger.lock"

echo Checking MongoDB status...
mongosh --eval "db.serverStatus()" >nul 2>&1
if %errorlevel% equ 0 (
    echo MongoDB is already running
) else (
    echo Starting MongoDB...
    
    REM Create data directory if it doesn't exist
    if not exist "data\db" mkdir "data\db"
    
    start "MongoDB" mongod --dbpath .\data\db --bind_ip 127.0.0.1
    
    echo Waiting for MongoDB to start...
    :wait_loop
    timeout /t 1 /nobreak >nul
    mongosh --eval "db.serverStatus()" >nul 2>&1
    if %errorlevel% equ 0 (
        echo MongoDB started successfully
    ) else (
        echo .
        goto wait_loop
    )
)

echo Starting Node.js server...
npm run dev 