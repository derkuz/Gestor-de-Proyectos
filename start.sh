#!/bin/bash

# start.sh
# Script para levantar el proyecto en Linux/macOS

echo -e "\n\033[1;30mLimpiando contenedores previos...\033[0m"
docker compose down

echo -e "\n\033[1;36mIniciando servicios...\033[0m"
docker compose up -d --build

echo -e "\n\033[1;30mEsperando a que el sistema este listo...\033[0m"
sleep 5

clear
echo -e "\033[1;36m------------------------------------------------\033[0m"
echo -e "\033[1;32mPROYECTO LEVANTADO CON EXITO!\033[0m"
echo -e "\033[1;36m------------------------------------------------\033[0m"
echo -e "Frontend: http://localhost:8080"
echo -e "Backend:  http://localhost:3000"
echo -e "Base de Datos: localhost:5434"
echo -e "\033[1;36m------------------------------------------------\033[0m"
echo -e ""
echo -e "Logs: 'docker compose logs -f'"
echo -e "\033[1;33mParar: 'docker compose down'\033[0m"
echo -e "------------------------------------------------"
echo -e ""
