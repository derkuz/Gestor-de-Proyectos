# 📜 Changelog - Gestor de Proyectos, Tareas y Tickets (GPTT)

Todas las modificaciones relevantes al proyecto serán documentadas aquí con fecha, hora y descripción.

---

## [8] 2026-03-01 02:00
- **Sistema de Autenticación (JWT):**
  - Implementación de `AuthModule` y `UsersModule`.
  - Endpoints de **Registro** y **Login** con hashing de contraseñas (Bcrypt).
  - Configuración de **Passport JWT Strategy** y `JwtAuthGuard`.
  - Ruta protegida de prueba `/profile`.
- **Seguridad:** Gestión de `JWT_SECRET` mediante variables de entorno.
