# start.ps1
Write-Host ""
Write-Host "Limpiando contenedores previos..." -ForegroundColor Gray
docker compose down -v

Write-Host ""
Write-Host "Iniciando servicios..." -ForegroundColor Cyan
docker compose up -d --build

Write-Host ""
Write-Host "Esperando a que el sistema esté listo y se sincronice la DB (20s)..." -ForegroundColor Gray
Start-Sleep -Seconds 20

## Crea los usuarios usando el script SQL.
Write-Host "Cargando usuarios base (SQL)..." -ForegroundColor Magenta
Get-Content init-users.sql | docker exec -i sgpt_db_container psql -U postgres -d sgpt_db

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
