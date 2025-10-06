@echo off
REM Kite Token Manager - Quick Start Script for Windows

echo 🪁 Kite Token Manager - Starting Services
echo ========================================
echo.

REM Check if .env exists in root
if not exist .env (
    echo ⚠️  No .env file found in root directory
    echo.
    echo Creating .env file...

    REM Generate encryption key
    cd backend
    for /f "tokens=*" %%i in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set ENCRYPTION_KEY=%%i
    cd ..

    echo ENCRYPTION_KEY=%ENCRYPTION_KEY%> .env
    echo ✅ Created .env with encryption key
    echo.
)

REM Check if backend .env exists
if not exist backend\.env (
    echo ⚠️  No backend/.env file found
    echo.
    echo Creating backend/.env...
    copy backend\.env.example backend\.env

    REM Read encryption key from root .env
    for /f "tokens=2 delims==" %%i in ('findstr "ENCRYPTION_KEY" .env') do set ENCRYPTION_KEY=%%i

    REM Note: Manual replacement needed for encryption key in backend/.env
    echo ⚠️  Please update ENCRYPTION_KEY in backend\.env manually
    echo.
)

REM Check if Docker is available
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo 🐳 Docker detected - Starting with Docker Compose
    echo.
    docker-compose up -d
    echo.
    echo ✅ Services started!
    echo.
    echo 📊 Dashboard: http://localhost:5173
    echo 🔧 Backend API: http://localhost:3000
    echo 🗄️  MongoDB: localhost:27017
    echo.
    echo View logs: docker-compose logs -f
    echo Stop services: docker-compose down
) else (
    echo ⚠️  Docker not found - Starting manually
    echo.

    REM Check if MongoDB is running
    tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
    if %errorlevel% neq 0 (
        echo ❌ MongoDB is not running!
        echo Please start MongoDB service first
        pause
        exit /b 1
    )

    echo ✅ MongoDB is running
    echo.

    REM Install dependencies if needed
    if not exist backend\node_modules (
        echo 📦 Installing backend dependencies...
        cd backend
        call npm install
        cd ..
    )

    if not exist froentend\node_modules (
        echo 📦 Installing frontend dependencies...
        cd froentend
        call npm install
        cd ..
    )

    echo.
    echo 🚀 Starting services...
    echo.

    REM Start backend in new window
    start "Kite Backend" cmd /k "cd backend && npm run dev"

    REM Wait a bit for backend to start
    timeout /t 3 /nobreak >nul

    REM Start frontend in new window
    start "Kite Frontend" cmd /k "cd froentend && npm run dev"

    echo.
    echo ✅ Services starting in separate windows
    echo.
    echo 📊 Dashboard: http://localhost:5173
    echo 🔧 Backend API: http://localhost:3000
)

pause
