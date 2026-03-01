# 📜 Changelog - Gestor de Proyectos, Tareas y Tickets (GPTT)

Todas las modificaciones relevantes al proyecto serán documentadas aquí con fecha, hora y descripción.

---

## [6] 2026-03-01 01:36
- **Migración de Backend:** Cambio de Deno a **Node.js** para mayor compatibilidad con NestJS.
  - Inicialización de proyecto NestJS mediante CLI.
  - Instalación de dependencias: `@nestjs/typeorm`, `typeorm`, `pg`, `@nestjs/config`.
- **Implementación de Entidades (TypeORM):**
  - `User`, `Project`, `Task`, `Ticket`, `Documentation`.
  - Configuración de relaciones (1:N, 1:1, Recursivas).
- **Configuración:** Conexión a PostgreSQL factorizada mediante variables de entorno (`.env`).
