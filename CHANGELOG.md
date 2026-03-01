# 📜 Changelog - Gestor de Proyectos, Tareas y Tickets (GPTT)

Todas las modificaciones relevantes al proyecto serán documentadas aquí con fecha, hora y descripción.

---

## [10] 2026-03-01 02:15
- **Implementación Completa de la API REST:**
  - **Módulo de Proyectos:** CRUD total con gestión de estados (`ACTIVO`, `PAUSADO`, `FINALIZADO`).
  - **Módulo de Tareas:** Soporte para jerarquías y restricciones basadas en el estado del proyecto.
  - **Módulo de Tickets:** Gestión de reportes y tickets de soporte vinculados a tareas.
  - **Módulo de Documentación:** Persistencia de contenido Markdown/Mermaid para cada proyecto.
- **Integración:** Protección de todos los endpoints mediante `JwtAuthGuard`.
- **Estabilidad:** Verificación exitosa del build de producción del backend.
