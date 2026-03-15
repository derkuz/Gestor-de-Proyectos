# 🔌 Conector MCP (Model Context Protocol) - Gestor de Proyectos

Este proyecto incluye un servidor **MCP (Model Context Protocol)** que permite a modelos de Inteligencia Artificial (como Claude, Gemini o locales via Ollama/AnythingLLM) interactuar directamente con la lógica de negocio del gestor de proyectos.

## 🚀 Propósito
El conector permite que la IA no solo lea el código, sino que **ejecute acciones reales** en la base de datos a través de los servicios de NestJS, garantizando que se cumplan todas las reglas de negocio (como validaciones de estado y logging de actividad).

## 🛠️ Herramientas Disponibles

La IA puede realizar las siguientes acciones a través del servidor MCP:

### 📁 Gestión de Proyectos
- `listar_proyectos`: Obtiene la lista completa de proyectos con su estado actual.
- `crear_proyecto(nombre, descripcion?)`: Crea un nuevo proyecto en el sistema.

### 📝 Gestión de Tareas
- `listar_tareas(proyectoId)`: Lista todas las tareas (principales y subtareas) de un proyecto.
- `crear_tarea(proyectoId, titulo, descripcion?, prioridad?, estado?)`: Crea una nueva tarea principal.
- `editar_tarea(id, data)`: Modifica campos de una tarea (título, descripción, prioridad, estado).
- `eliminar_tarea(id)`: Elimina una tarea permanentemente.

### 📄 Gestión de Documentación
- `listar_documentos(proyectoId)`: Lista los recursos y documentos MD asociados a un proyecto.
- `crear_documento(proyectoId, titulo, tipo, url?, contenido?)`:
    - **Tipo MD**: Guarda contenido Markdown en el sistema de archivos y crea el registro.
    - **Tipo Link**: Guarda un enlace externo (Drive, Figma, etc.).
- `editar_documento(id, data)`: Actualiza el título o contenido de un proyecto.
- `eliminar_documento(id)`: Elimina el registro y el archivo físico (si es MD).

## ⚙️ Configuración Técnica

El servidor MCP se encuentra en `backend/src/mcp-server.ts` y utiliza el transporte **STDIO**.

### Cómo ejecutarlo
Para que un cliente MCP pueda usar este conector, debe llamar al binario compilado del backend:

```bash
# Compilar el proyecto
npm run build

# Ejecutar el servidor MCP (los clientes lo llamarán así)
node dist/src/mcp-server.js
```

### Integración con Clientes
Si usas Claude Desktop, puedes añadirlo a tu `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "gestor-proyectos": {
      "command": "node",
      "args": ["/ruta/absoluta/al/proyecto/backend/dist/src/mcp-server.js"]
    }
  }
}
```

## 🔒 Reglas de Seguridad
- El servidor MCP utiliza el `ApplicationContext` de NestJS, lo que significa que **respeta todas las validaciones** de los servicios internos.
- Las acciones que modifican datos (crear/editar/eliminar) generan automáticamente entradas en el `ActivityLog` del sistema para auditoría.
