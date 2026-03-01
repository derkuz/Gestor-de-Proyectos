# 🚀 Gestor de Proyectos, Tareas y Tickets (GPTT)

Aquí tienes el **Documento de Requerimientos Funcionales (DRF)** estructurado para tu proyecto. Este documento sirve como la "hoja de ruta" para que el desarrollo en **NestJS** y **Vue 3** sea exitoso y cubra todas tus necesidades.

---

# 📋 Documento de Requerimientos Funcionales (DRF)

**Proyecto:** Sistema Integral de Gestión de Proyectos, Tareas y Tickets (SGPT)

**Versión:** 1.1

**Analista:** Gemini (Analista Funcional)

---

## 1. Resumen Ejecutivo

El sistema tiene como objetivo centralizar la gestión de proyectos mediante una jerarquía estructurada de trabajo (Proyectos > Tareas > Subtareas) y un sistema de soporte al cliente (Tickets). El sistema permitirá la trazabilidad total desde un reporte externo hasta su finalización técnica.

---

## 2. Definición de Roles y Permisos (RBAC)

El sistema operará bajo un esquema de control de acceso basado en roles:

| Rol | Descripción | Permisos Clave |
| --- | --- | --- |
| **Administrador** | Gestión total del sistema. | Crear Proyectos, Gestionar Usuarios, Configurar Estados. |
| **Project Manager** | Responsable de la ejecución. | Crear Tareas Principales, Asignar Responsables, Ver Dashboard. |
| **Colaborador** | Personal operativo. | Crear Subtareas (en tareas asignadas), Cambiar estados de subtareas. |
| **Usuario Externo** | Cliente o solicitante. | Crear Tickets, Ver estado de sus propios tickets. |

---

## 3. Requerimientos Funcionales (RF)

### 3.1 Gestión de Proyectos y Tareas

* **RF-01: Ciclo de Vida del Proyecto:**
    * El sistema debe permitir crear múltiples proyectos (Solo `Administrador`).
    * Un proyecto puede estar en estado: `ACTIVO`, `PAUSADO` o `FINALIZADO`.
    * **Lógica de Bloqueo:** Si un proyecto está `PAUSADO` o `FINALIZADO`, ninguna de sus tareas o subtareas puede ser modificada (Lectura únicamente).
    * **Retorno a Actividad:** Un proyecto en estado `PAUSADO` puede ser cambiado nuevamente a `ACTIVO` para habilitar la edición.
* **RF-02: Tareas Principales:** Dentro de cada proyecto, se podrán crear tareas de primer nivel. Requiere rol `Project Manager`.
* **RF-03: Subtareas Jerárquicas:** Cada tarea principal puede desglosarse en n-subtareas. Solo los usuarios asignados a la tarea padre o con "Super Permiso" pueden crearlas.
* **RF-04: Gestión de Prioridades:** Tanto tareas principales como subtareas deben contar con niveles de prioridad (ej: Baja, Media, Alta, Crítica).
* **RF-05: Estados Personalizados:** Las tareas principales pueden tener estados definidos por el usuario, pero el sistema validará la existencia obligatoria de los estados `PENDIENTE` y `FINALIZADO`.

### 3.2 Sistema de Tickets

* **RF-06: Generación de Tickets:** Permitir a usuarios internos y externos crear tickets de incidencia o requerimiento.
* **RF-07: Conversión a Tarea:** El `Project Manager` debe poder transformar un Ticket en una Tarea Principal o Subtarea con un solo clic, manteniendo el ID del ticket como referencia.
* **RF-08: Gestión de Respuestas:** Los tickets deben permitir un hilo de conversación entre el solicitante y el equipo interno.

### 3.3 Visualización y Seguimiento

* **RF-09: Dashboard de Progreso:** Pantalla con indicadores de avance.
* **Cálculo:** Solo se contabilizan tareas principales.
* **Fórmula:** $Progreso = (\text{Tareas Finalizadas} / \text{Total Tareas Principales}) \times 100$


* **RF-10: Tablero Kanban:** Visualización dinámica de tareas por columnas de estado con capacidad de *Drag & Drop*.
* **RF-11: Diagrama de Gantt:** Visualización cronológica de las tareas principales para identificar dependencias y tiempos de entrega.

---

## 4. Requerimientos No Funcionales (RNF)

* **RNF-01: Arquitectura:** Separación física de capas. Backend en `/backend` (**NestJS sobre Deno**) y Frontend en `/frontend` (**Vue 3**).
* **RNF-02: Escalabilidad:** El backend debe utilizar un ORM (TypeORM) para facilitar la migración o crecimiento de la base de datos.
* **RNF-03: Interfaz de Usuario:** El diseño debe ser responsivo (Mobile First) utilizando **Tailwind CSS** para un estilizado moderno y eficiente.

---

## 5. Matriz de Estados (Lógica de Negocio)

### 5.1 Estados del Proyecto
| Estado | Restricción | Descripción |
| --- | --- | --- |
| **Activo** | Ninguna | El proyecto permite edición normal de tareas y subtareas. |
| **Pausado** | Read-Only | No se permite editar tareas. Puede volver a `Activo`. |
| **Finalizado** | Read-Only | Bloqueo definitivo para histórico. |

### 5.2 Estados de Tarea
| Estado | Tipo | Descripción |
| --- | --- | --- |
| **Pendiente** | Obligatorio | Estado inicial de toda tarea/subtarea. |
| **En Desarrollo** | Opcional | Tarea en ejecución. |
| **Bloqueado** | Opcional | Tarea detenida por factores externos. |
| **Finalizado** | Obligatorio | Tarea completada. Activa el cálculo de progreso en el Dashboard. |

---

## 6. Modelo de Datos (Entidades)

### 6.1 Proyectos (`Project`)
- `id`: UUID (PK)
- `nombre`: String
- `descripcion`: Text
- `estado`: Enum (`ACTIVO`, `PAUSADO`, `FINALIZADO`)
- `fechaCreacion`: DateTime

### 6.2 Tareas (`Task`)
- `id`: UUID (PK)
- `proyectoId`: UUID (FK)
- `nombre`: String
- `prioridad`: Enum (`BAJA`, `MEDIA`, `ALTA`, `CRITICA`)
- `estado`: String (ej: Pendiente, En Desarrollo)
- `esSubtarea`: Boolean
- `padreId`: UUID (FK, opcional)

### 6.3 Tickets (`Ticket`)
- `id`: UUID (PK)
- `codigo`: String (ej: TKT-001)
- `titulo`: String
- `mensaje`: Text
- `estado`: String
- `tareaRelacionadaId`: UUID (FK, opcional)
- `solicitanteId`: UUID (FK)

### 6.4 Usuarios (`User`)
- `id`: UUID (PK)
- `email`: String (Unique)
- `password`: String (Hash)
- `nombre`: String
- `rol`: Enum (`ADMIN`, `PROJECT_MANAGER`, `COLABORADOR`, `EXTERNO`)

---

## 7. Próximos Pasos Sugeridos

1. **Modelado de Datos:** Definir las entidades en TypeORM para Proyectos, Usuarios, Tareas y Tickets.
2. **Maquetado (Wireframes):** Diseñar la vista del Dashboard y el Kanban en Vue.
3. **Core de Auth:** Implementar el módulo de autenticación con JWT en NestJS para diferenciar los roles.

¿Te parece que este documento refleja bien lo que tienes en mente o te gustaría que profundice en algún punto de la lógica de los tickets?