#!/bin/bash
set -e

echo "================================================"
echo "      Despliegue de FitCoach Pro en VM          "
echo "================================================"

# Determinar el directorio base del script
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BASE_DIR"

if [ -d "$BASE_DIR/plataforma-entrenamiento/services" ]; then
  SERVICES_DIR="$BASE_DIR/plataforma-entrenamiento/services"
elif [ -d "$BASE_DIR/services" ]; then
  SERVICES_DIR="$BASE_DIR/services"
else
  echo "Error: No se encontró la carpeta de servicios."
  exit 1
fi

SERVICES=("api-usuarios" "api-entrenamientos" "api-nutricion" "api-recompensas")

echo "--> Realizando npm install masivo para los microservicios..."
for service in "${SERVICES[@]}"; do
  SERVICE_PATH="$SERVICES_DIR/$service"
  if [ -d "$SERVICE_PATH" ]; then
    echo "  [+] Instalando dependencias en $service..."
    (cd "$SERVICE_PATH" && npm install --production=false)
  else
    echo "  [!] Advertencia: $SERVICE_PATH no existe."
  fi
done

echo "--> Iniciando / Recargando microservicios con PM2..."
if command -v pm2 &> /dev/null; then
  pm2 startOrReload ecosystem.config.js || pm2 start ecosystem.config.js
  pm2 save
  pm2 status
else
  echo "  [!] PM2 global no encontrado. Ejecutando con npx pm2..."
  npx pm2 startOrReload ecosystem.config.js || npx pm2 start ecosystem.config.js
  npx pm2 status
fi

echo "================================================"
echo " ¡Despliegue completado exitosamente!          "
echo " Microservicios corriendo en puertos 3001-3004 "
echo "================================================"
