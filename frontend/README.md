# Gestor de Proyectos - Frontend

Este es el cliente web desarrollado con **Vue 3**, **Vite**, **Tailwind CSS** y **Pinia**.

Puedes encontrar una descripción detallada de la arquitectura en: [ESTRUCTURA_FRONTEND.md](./ESTRUCTURA_FRONTEND.md)


## Requisitos Previos

- **Node.js**: Versión 18 o superior.
- **npm**: Viene incluido con Node.js.

## Cómo levantar el proyecto

Para iniciar el servidor de desarrollo, sigue estos pasos:

1.  **Abrir una terminal** en la carpeta `frontend`:
    ```powershell
    cd "c:/Users/juano/OneDrive/Documentos/Proyectos/Gestor de PRoyectos/frontend"
    ```

2.  **Instalar dependencias** (solo es necesario la primera vez o si cambian los paquetes):
    ```powershell
    npm install
    ```

3.  **Ejecutar el servidor de desarrollo**:
    ```powershell
    npm run dev
    ```

4.  **Acceder a la aplicación**:
    Una vez que el comando esté corriendo, verás una URL (generalmente `http://localhost:5173`). Haz clic en ella o cópiala en tu navegador.

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo con Hot Module Replacement (HMR).
- `npm run build`: Compila el proyecto para producción en la carpeta `dist`.
- `npm run preview`: Sirve localmente la versión compilada de producción.

## Tecnologías Utilizadas

- **Vue 3**: Framework progresivo de JavaScript.
- **Vite**: Herramienta de construcción ultrarrápida.
- **Pinia**: Manejo de estado global fluido.
- **Tailwind CSS v4**: Para un diseño moderno y responsivo.
- **Vue Router**: Gestión de navegación y rutas.

## 👥 Usuarios de Prueba

Para probar el sistema de **Roles y Permisos (RBAC)**, puedes utilizar las siguientes credenciales preconfiguradas:

| Rol | Email | Password | Permisos |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gptt.com` | `admin123` | Control total. Gestiona categorías, proyectos y ve todos los tickets. |
| **Líder (PM)** | `pm@gptt.com` | `pm123` | Gestiona proyectos y tareas. Sin acceso a categorías. |
| **Colaborador** | `colab@gptt.com` | `colab123` | Crea subtareas y documentación. Responde tickets autorizados. |
| **Externo** | `externo@gptt.com` | `ext123` | Solo crea sus tickets y ve el progreso del proyecto (Lectura). |

-- Insertar Administrador
INSERT INTO "user" (email, password, nombre, rol) 
VALUES ('admin@ejemplo.com', '$2b$10$EpJ6Tf.B.C6G7yP6U6G6Uu8v8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', 'Admin Sistema', 'ADMIN');

-- Insertar Project Manager
INSERT INTO "user" (email, password, nombre, rol) 
VALUES ('pm@ejemplo.com', '$2b$10$EpJ6Tf.B.C6G7yP6U6G6Uu8v8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', 'Gerente de Proyectos', 'PROJECT_MANAGER');

-- Insertar Colaborador (Desarrollador)
INSERT INTO "user" (email, password, nombre, rol) 
VALUES ('dev@ejemplo.com', '$2b$10$EpJ6Tf.B.C6G7yP6U6G6Uu8v8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', 'Desarrollador Senior', 'COLABORADOR');

-- Insertar Usuario Externo (Cliente)
INSERT INTO "user" (email, password, nombre, rol) 
VALUES ('cliente@ejemplo.com', '$2b$10$EpJ6Tf.B.C6G7yP6U6G6Uu8v8z8z8z8z8z8z8z8z8z8z8z8z8z8z8', 'Cliente VIP', 'EXTERNO');

password123
