@echo off
echo 🚀 Iniciando Proxy iFood - FoodCost
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado! Instale o Node.js primeiro.
    echo 📥 Download: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependências!
        pause
        exit /b 1
    )
)

echo ✅ Dependências instaladas
echo 🚀 Iniciando servidor na porta 3001...
echo 📡 Teste: http://localhost:3001/api/test
echo.

npm start

pause

