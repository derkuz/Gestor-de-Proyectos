# 📜 Changelog - Gestor de Proyectos, Tareas y Tickets (GPTT)

Todas las modificaciones relevantes al proyecto serán documentadas aquí con fecha, hora y descripción.

---

## [26] 2026-03-03 21:30
- **Dockerización Integral del Proyecto**:
  - Creación de `Dockerfile` optimizados para **Backend** (NestJS) y **Frontend** (Nginx/Vite).
  - Configuración de `docker-compose.yml` para orquestar Backend, Frontend y PostgreSQL 17.
  - Implementación de **Volúmenes persistentes** para la base de datos y archivos subidos (`uploads`).
  - Configuración de **Healthchecks** para asegurar que el backend espere a la DB antes de iniciar.
- **Automatización Multiplataforma**:
  - Nuevo script `start.ps1` para Windows (PowerShell) que automatiza el despliegue y muestra accesos.
  - Nuevo script `start.sh` para Linux/macOS (Bash) con compatibilidad total.
- **Configuración de Entorno**:
  - Creación de archivos `.env.example` detallados para facilitar la configuración inicial.
- **Documentación de Despliegue**:
  - Actualización completa del `README.MD` con la nueva guía de instalación rápida mediante Docker.

---

## [25] 2026-03-01 15:15
- **Rediseño de Lista de Tickets**:
  - Migración de diseño de tarjetas a un formato de **Filas/Tabla profesional** con mejor densidad de datos.
  - Adaptabilidad total para móviles y visualización de estados con badges animados.
- **IDs Inteligentes y Secuenciales**:
  - Implementación de campo `codigo` (ej: `TEC-001`) para una identificación humana sencilla.
  - Generación automática basada en **Prefijos por Categoría** gestionables desde el panel.
  - Actualización de toda la UI para usar estos códigos en lugar de UUIDs.
- **Sistema de Roles y Permisos (RBAC)**:
  - Creación de `RolesGuard` y decorador `@Roles` para protección granular de la API.
  - Definición de 4 perfiles: **Admin** (Control total), **Líder de Proyecto** (PM), **Colaborador** (Especialista) y **Externo** (Cliente).
  - Lógica de visibilidad de tickets: los colaboradores solo ven tickets de categorías donde están autorizados.
- **Gestión Avanzada de Categorías**:
  - Panel administrativo para asignar especialistas a categorías específicas.
  - Acceso directo a configuración desde la cabecera de tickets para administradores.
- **Documentación de Pruebas**:
  - Creación de 4 usuarios de prueba funcionales y su documentación exhaustiva en el README del frontend.


## [24] 2026-03-01 05:20
- **Simplificación de Documentación:**
  - Rediseño de la sección a una **Lista de Enlaces** minimalista.
  - Eliminación de fondos y bordes innecesarios para una visualización más limpia.
  - Comportamiento de subrayado (underline) al pasar el ratón para reforzar la metáfora de enlace.

## [23] 2026-03-01 05:10
- **Refinamiento de Documentación:**
  - Cambio de diseño de cuadrícula (cartas) a **Lista Compacta** para mejor escalabilidad.
  - Visualización inteligente de extensiones (ej: `.md`) en los títulos.
  - Micro-interacciones mejoradas al abrir y gestionar documentos.

## [22] 2026-03-01 05:00
- **Gestión de Múltiples Documentos:**
  - Migración a relación **Muchos a Uno** para permitir varios documentos por proyecto.
  - Nueva vista de **Lista de Documentos** con tarjetas interactivas.
  - Implementación de **Editor de Markdown** a pantalla completa con vista previa en tiempo real.
  - Soporte para **Enlaces Externos** (recursos web, Drive, Figma, etc.).
  - Funcionalidad de eliminación y gestión individualizada de archivos.

## [21] 2026-03-01 04:45
- **Módulo de Documentación y Reorganización UI:**
  - Nueva estructura: Descripción (Full Width), Progreso y Documentación centralizados.
  - Implementación de editor de **Markdown** para documentación técnica del proyecto.
  - Integración de `marked` para renderizado fluido de guías y notas.
  - Eliminación de sidebar lateral antigua para maximizar el área de trabajo.

## [20] 2026-03-01 04:30
- **Asignación de Usuarios a Tareas:**
  - Implementación de relación **Muchos a Muchos** entre Tareas y Usuarios.
  - Nuevo selector múltiple en el modal de creación de tareas.
  - Visualización de **colaboradores asignados** mediante iniciales en Kanban y Lista.
  - Nuevo endpoint `GET /users` para gestión de colaboradores.

## [19] 2026-03-01 04:15
- **Interfaz Unificada por Pestañas:**
  - Refactorización de la sección de tareas en Detalles del Proyecto.
  - Implementación de pestañas: **Kanban** (por defecto), **Lista** y **Gantt**.
  - Eliminación de navegación externa para Kanban, centralizando toda la gestión.
  - Sincronización de eventos entre componentes modulares.

## [18] 2026-03-01 03:55
- **Tablero Kanban Interactivo:**
  - Implementación de vista **Kanban** con drag-and-drop (arrastrar y soltar).
  - Columnas dinámicas: Pendiente, En Desarrollo, Bloqueado, Finalizado.
  - Sincronización automática con el backend al mover tareas.
  - Diseño premium con cristalismo y barras de prioridad coloridas.

## [17] 2026-03-01 03:45
- **Jerarquía de Trabajo y Subtareas:**
  - Soporte para **descripciones ricas** en todas las tareas.
  - Implementación de **subtareas** vinculadas a tareas principales.
  - Nueva interfaz de **Acordeón** en Detalles del Proyecto: las tareas se expanden para revelar detalles y gestión de subtareas.
  - **Ajuste de Progreso**: El cálculo de avance del proyecto ahora ignora las subtareas y se basa exclusivamente en las **tareas principales**, siguiendo el estándar RF-09.

## [16] 2026-03-01 03:30
- **Gestión de Tareas en Proyectos:**
  - Nuevo **Store de Tareas** con Pinia para gestión completa (CRUD).
  - Interfaz de **Detalles del Proyecto** mejorada con:
    - Lista de tareas interactiva con prioridades y estados.
    - Cambio de estado de tareas con un clic (Toggle check).
    - Modal de creación de tareas con selección de prioridad.
    - **Panel de Estadísticas** dinámico que calcula el progreso real del proyecto en base a las tareas finalizadas.
  - Validación de lógica de negocio: las tareas solo pueden editarse si el proyecto está en estado ACTIVO.

## [15] 2026-03-01 03:20
- **Correcciones en Proyectos y Tickets:**
  - **Tickets**: Corregida la creación de tickets (mapeo de campos `titulo`/`mensaje`) y vinculación automática al usuario creador.
  - **Filtro de Tickets**: Los usuarios ahora solo ven sus propios tickets (los administradores siguen viendo todos).
  - **Detalle de Proyecto**: Implementada la vista detallada (`/projects/:id`) con tareas y documentación.
  - **Navegación**: Corregido flujo de rutas en el layout principal.

## [14] 2026-03-01 03:10
- **Gestión de Proyectos y Tickets (Frontend):**
  - Nuevo **Layout Principal** con barra lateral premium y navegación fluida.
  - Implementación del módulo de **Proyectos**: lista de tarjetas dinámicas y creación mediante modales.
  - Implementación del módulo de **Tickets**: sistema de soporte con creación y resolución de incidencias.
  - Sincronización en tiempo real de estadísticas en el Dashboard.

## [13] 2026-03-01 02:30
- **Autenticación en el Frontend:**
  - Implementación de flujos de **Login** y **Registro** con diseño premium (Glassmorphism).
  - Gestión de estado global con **Pinia** (auth store).
  - Configuración de **Axios** con interceptores para manejo automático de tokens JWT.
  - Protección de rutas con **Navigation Guards** de Vue Router.

## [12] 2026-03-01 02:25
- **Pruebas Unitarias:**
  - Implementación de **12 suites de pruebas** con un total de **30 tests** pasando en el backend.
  - Cobertura de lógica de `Auth`, `Projects`, `Tasks`, `Tickets` y `Documentation`.

## [11] 2026-03-01 02:20
- **Integración con Model Context Protocol (MCP):**
  - Implementación de un servidor puente (`src/mcp-server.ts`) para IA.
  - Exposición de herramientas: `listar_proyectos`, `crear_proyecto`.

## [10] 2026-03-01 02:15
- **Implementación Completa de la API REST:**
  - Desarrollo de módulos: `Projects`, `Tasks`, `Tickets` y `Documentation`.
  - Reglas de negocio para estados de proyecto y jerarquías de tareas.
  - Protección de endpoints con JWT.
