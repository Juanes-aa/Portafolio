#!/bin/bash

# Script de deploy automático para Netlify
# Autor: Juan Esteban López Moreno

echo "🚀 Deploy Script - Portfolio Backend"
echo "======================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde la raíz del proyecto backend"
    exit 1
fi

# Verificar que .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Advertencia: No se encontró .env"
    echo "Creando desde .env.example..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Por favor, configura tus credenciales antes de continuar."
    exit 1
fi

# Verificar que las variables de entorno están configuradas
source .env
if [ -z "$EMAIL_USER" ] || [ -z "$EMAIL_PASS" ]; then
    echo "❌ Error: Variables de entorno EMAIL_USER y EMAIL_PASS no configuradas en .env"
    exit 1
fi

echo "✅ Variables de entorno configuradas"
echo ""

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    echo "✅ Dependencias instaladas"
    echo ""
fi

# Verificar si Netlify CLI está instalado
if ! command -v netlify &> /dev/null; then
    echo "📦 Netlify CLI no encontrado. Instalando..."
    npm install -g netlify-cli
    echo "✅ Netlify CLI instalado"
    echo ""
fi

# Login en Netlify si no está logueado
echo "🔐 Verificando autenticación en Netlify..."
if ! netlify status &> /dev/null; then
    echo "Iniciando login en Netlify..."
    netlify login
fi

echo ""
echo "🚀 Desplegando a Netlify..."
netlify deploy --prod

echo ""
echo "✅ ¡Deploy completado!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Ve a https://app.netlify.com para ver tu sitio"
echo "2. Configura las variables de entorno en Netlify:"
echo "   - Site settings > Environment variables"
echo "   - Agrega EMAIL_USER y EMAIL_PASS"
echo "3. Actualiza la URL en tu frontend"
echo ""
