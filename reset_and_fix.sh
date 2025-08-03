#!/bin/bash
set -e

echo "🔹 [1/6] Removendo dependências antigas e cache..."
rm -rf node_modules package-lock.json lib
npm cache clean --force

echo "🔹 [2/6] Instalando versões compatíveis (firebase-functions v3 + firebase-admin v11)..."
npm install firebase-functions@3.24.1 firebase-admin@11.11.1

# Corrigindo vulnerabilidades sem forçar breaking changes...
echo "🔹 [3/6] Corrigindo vulnerabilidades sem forçar breaking changes..."
npm audit fix || true

echo "🔹 [4/6] Limpando builds antigos..."
rm -rf lib

echo "🔹 [5/6] Recompilando projeto..."
npm run build

echo "🔹 [6/6] Fazendo deploy da função para o Firebase..."
firebase deploy --only functions

echo "✅ Processo concluído com sucesso!"
npm install