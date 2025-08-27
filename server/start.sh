#!/bin/bash

echo "🚀 Iniciando Proxy iFood - FoodCost"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado! Instale o Node.js primeiro."
    echo "📥 Download: https://nodejs.org/"
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao instalar dependências!"
        exit 1
    fi
fi

echo "✅ Dependências instaladas"
echo "🚀 Iniciando servidor na porta 3001..."
echo "📡 Teste: http://localhost:3001/api/test"
echo ""

npm start

