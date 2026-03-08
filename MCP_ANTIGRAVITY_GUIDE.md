# Guía de Conexión: Proyecto con Antigravity (Google) vía MCP

Esta documentación explica cómo funciona el Model Context Protocol (MCP) en este proyecto y cómo configurarlo para que la IA **Antigravity** pueda interactuar directamente con tu lógica de negocio y base de datos local.

---

## 1. ¿Qué es MCP?

El **Model Context Protocol (MCP)** es un estándar abierto que actúa como un "puente" entre una IA y fuentes de datos o herramientas locales. 

En lugar de que la IA solo vea tus archivos de texto, MCP le permite:
- Consultar la base de datos en tiempo real.
- Ejecutar funciones específicas del backend.
- Acceder a recursos dinámicos.

---

## 2. Arquitectura de Conexión (Modo Local)

La conexión funciona bajo un modelo **Cliente-Servidor**:

1.  **Servidor MCP (Tu Proyecto):** Ubicado en `backend/src/mcp-server.ts`. Este proceso expone las herramientas al exterior.
2.  **Cliente MCP (Antigravity):** La extensión/app de IA que utilizas para programar. Al configurarlo, Antigravity "levanta" tu servidor en segundo plano y se comunica con él.
3.  **Transporte:** Se utiliza `stdio` (entrada/salida estándar), lo cual es ideal para ejecuciones locales rápidas y seguras.

---

## 3. Configuración del Servidor en este Proyecto

Tu proyecto ya tiene una base implementada. Aquí está lo que puedes hacer:

### Herramientas actuales (`Tools`)
- `listar_proyectos`: Obtener todos los proyectos.
- `crear_proyecto`: Crear un proyecto nuevo.
- `listar_tareas`: Obtener todas las tareas del sistema.
- `crear_tarea`: Crear una tarea en un proyecto específico.
- `modificar_tarea`: Actualizar estado, nombre o descripción de una tarea.
- `crear_documentacion`: Agregar documentos (soporta contenido Markdown).
- `modificar_documentacion`: Editar títulos o contenido de documentos existentes.
- `listar_tickets`: Ver todos los tickets de soporte.
- `crear_ticket`: Crear un nuevo ticket de soporte.
- `modificar_ticket`: Actualizar un ticket (estado, respuestas, etc).

### Cómo ejecutarlo manualmente (para pruebas)
Para verificar que el servidor funciona, abre una terminal en la raíz del proyecto y ejecuta:
```powershell
cd backend
npm run mcp
```
*(Verás que la terminal queda en espera; esto es normal ya que espera comandos JSON del cliente).*

---

## 4. Cómo conectar con Antigravity (Específico)

Para que **Antigravity** reconozca estas herramientas, debes registrar el servidor en su configuración local.

### Paso 1: Localizar el archivo de configuración
Antigravity usualmente busca su configuración de MCP en una de estas rutas (dependiendo de tu instalación):
- `%APPDATA%\Antigravity\mcp_config.json`
- O a través de la interfaz de usuario en: **Ajustes > Extensiones > Antigravity > MCP Configuration**.

### Paso 2: Añadir el servidor
Copia y pega el siguiente bloque en tu archivo `mcp_config.json`:

```json
{
  "mcpServers": {
    "gestor-proyectos-local": {
      "command": "npm",
      "args": [
        "--prefix", 
        "C:\\Users\\juano\\OneDrive\\Documentos\\Proyectos\\Gestor de PRoyectos\\backend", 
        "run", 
        "mcp"
      ],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

> [!IMPORTANT]
> Asegúrate de que la ruta en `args` coincida exactamente con la ubicación de tu carpeta `backend`.

### Paso 3: Reiniciar Antigravity
Una vez guardado el archivo, reinicia la extensión o la aplicación. Ahora deberías ver que Antigravity tiene acceso a las herramientas `listar_proyectos` y `crear_proyecto`.

---

## 5. Expandiendo las Capacidades

Si deseas que la IA pueda hacer más cosas (ej. gestionar tickets, tareas o archivos), simplemente debes editar el archivo:
`backend/src/mcp-server.ts`

1.  **Define la nueva herramienta** en el manejador `ListToolsRequestSchema`.
2.  **Implementa la lógica** en el manejador `CallToolRequestSchema` conectándolo con los servicios de NestJS correspondientes.

---

## 6. Resolución de Problemas (Troubleshooting)

- **Error de Node/NPM:** Asegúrate de que `npm` esté en tu PATH de Windows.
- **Error de Rutas:** Si mueves el proyecto de carpeta, debes actualizar la ruta en el `mcp_config.json`.
- **Logs:** El servidor MCP no debe usar `console.log` para depuración (ya que rompe la comunicación `stdio`). Usa `console.error` si necesitas ver logs en la consola de Antigravity.
