# Estructura del Frontend - Gestor de Proyectos

Este documento describe la arquitectura y organización del código del frontend del proyecto.

## 🛠️ Tecnologías Principales

- **Framework:** [Vue 3](https://vuejs.org/) (Composition API)
- **Herramienta de Construcción:** [Vite](https://vitejs.dev/)
- **Gestión de Estado:** [Pinia](https://pinia.vuejs.org/)
- **Enrutamiento:** [Vue Router](https://router.vuejs.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Librerías Adicionales:**
  - `vuedraggable`: Para funcionalidades de arrastrar y soltar (Kanban).
  - `marked`: Para renderizado de Markdown en la documentación.

## 📂 Organización de Directorios

La carpeta `src/` es el núcleo de la aplicación y se organiza de la siguiente manera:

### 1. `api/`
Contiene la configuración de Axios y las definiciones de los endpoints para interactuar con el backend.

### 2. `components/`
Componentes Vue reutilizables que no representan una página completa.
- `KanbanBoard.vue`: Implementación del tablero Kanban.
- `GanttPlaceholder.vue`: Visualización para el diagrama de Gantt.
- `TaskListView.vue`: Vista de lista de tareas detallada.
- `InputModal.vue`: Componente modal genérico para entradas de usuario.

### 3. `views/`
Componentes que representan las páginas principales de la aplicación, mapeados a rutas específicas.
- `Dashboard.vue`: Página de inicio/resumen.
- `Projects.vue`: Listado y gestión de proyectos.
- `ProjectDetails.vue`: Vista detallada de un proyecto específico.
- `Tickets.vue`: Sistema de gestión de tickets de soporte.
- `DocumentEditor.vue`: Editor y visor de documentación en Markdown.
- `CategoryManagement.vue`: Gestión de categorías de tareas.
- `Login.vue` / `Register.vue`: Autenticación de usuarios.

### 4. `store/`
Módulos de Pinia para la gestión del estado global:
- `auth.js`: Sesión de usuario y permisos.
- `projects.js`: Estado de la lista de proyectos.
- `tasks.js`: Gestión de tareas y subtareas.
- `tickets.js`: Estado de los tickets de soporte.
- `documentation.js`: Gestión de documentos y archivos subidos.
- `categories.js`: Categorías de tareas.
- `users.js`: Información de usuarios del sistema.

### 5. `router/`
- `index.js`: Definición de todas las rutas de la aplicación y guardias de navegación para proteger rutas privadas.

### 6. `layouts/`
Componentes de estructura general (ej. Navbars, Sidebars) que envuelven a las vistas.

### 7. `assets/`
Archivos estáticos como imágenes, logos y estilos globales CSS.

## 🚀 Flujo de Datos
1. El usuario interactúa con una **View** o **Component**.
2. Estos llaman a una acción en un **Store** de Pinia.
3. El **Store** realiza una petición al backend usando el cliente en **api**.
4. El **Store** actualiza el estado local con la respuesta.
5. Vue reacciona al cambio de estado y actualiza la interfaz automáticamente.
