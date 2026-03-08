# start.ps1
Write-Host ""
Write-Host "Limpiando contenedores previos..." -ForegroundColor Gray
docker compose down -v

Write-Host ""
Write-Host "Iniciando servicios..." -ForegroundColor Cyan
docker compose up --build

Write-Host ""
Write-Host "Esperando a que el sistema este listo..." -ForegroundColor Gray
Start-Sleep -Seconds 5

## Crea los usuarios.
docker compose exec backend npx prisma db seed

Clear-Host
Write-Host "------------------------------------------------" -ForegroundColor Cyan
Write-Host "PROYECTO LEVANTADO CON EXITO!" -ForegroundColor Green
Write-Host "------------------------------------------------" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:8080"
Write-Host "Backend:  http://localhost:3000"
Write-Host "Base de Datos: localhost:5434"
Write-Host "------------------------------------------------" -ForegroundColor Cyan
Write-Host ""
Write-Host "Iniciando logs (Presiona Ctrl+C para salir de los logs)..."
docker compose logs -f
Write-Host "Parar: 'docker compose down'" -ForegroundColor Yellow
Write-Host "------------------------------------------------"
Write-Host ""
