#!/bin/bash

echo "🔹 Iniciando limpeza do Secret Manager local do Firebase..."

# Remove a chave secreta GEMINI_API_KEY do Firebase
firebase functions:secrets:destroy GEMINI_API_KEY --force

echo "✅ Secret GEMINI_API_KEY removido do Firebase."

echo "🔹 Agora você pode iniciar o emulador apenas com a chave local:"
echo ""
echo "export GEMINI_API_KEY=AIzaSyDDFTYgevul6NNNjdMsSwFslHp5Evz2cTs && firebase emulators:start --only functions"
echo ""
echo "⚠️ Se ainda aparecer a chave antiga nos logs, feche todos os terminais e reinicie o VS Code para limpar o cache."