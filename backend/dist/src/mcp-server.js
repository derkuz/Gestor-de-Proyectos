"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const zod_to_json_schema_1 = require("zod-to-json-schema");
const zodToJsonSchema = zod_to_json_schema_1.zodToJsonSchema;
const zod_1 = require("zod");
const app_module_1 = require("./app.module");
const projects_service_1 = require("./projects/projects.service");
const tasks_service_1 = require("./tasks/tasks.service");
const documentation_service_1 = require("./documentation/documentation.service");
const tickets_service_1 = require("./tickets/tickets.service");
const originalStdoutWrite = process.stdout.write;
process.stdout.write = function (...args) {
    const chunk = args[0];
    if (typeof chunk === 'string' && (chunk.startsWith('{') || chunk.trim().startsWith('{'))) {
        return originalStdoutWrite.apply(process.stdout, args);
    }
    return process.stderr.write.apply(process.stderr, args);
};
async function bootstrap() {
    process.env.NODE_NO_WARNINGS = '1';
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, {
        logger: false,
    });
    const projectsService = app.get(projects_service_1.ProjectsService);
    const tasksService = app.get(tasks_service_1.TasksService);
    const docService = app.get(documentation_service_1.DocumentationService);
    const ticketsService = app.get(tickets_service_1.TicketsService);
    const server = new index_js_1.Server({ name: 'gestor-proyectos-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });
    const DEFAULT_EMPRESA_ID = 'd2b5a5b5-5b5b-4b5b-8b5b-5b5b5b5b5b5b';
    server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: 'listar_proyectos',
                    description: 'Obtiene todos los proyectos.',
                    inputSchema: zodToJsonSchema(zod_1.z.object({})),
                },
                {
                    name: 'crear_proyecto',
                    description: 'Crea un proyecto.',
                    inputSchema: zodToJsonSchema(zod_1.z.object({
                        nombre: zod_1.z.string(),
                        descripcion: zod_1.z.string().optional()
                    })),
                },
                {
                    name: 'listar_tareas',
                    description: 'Obtiene todas las tareas asociadas a los proyectos.',
                    inputSchema: zodToJsonSchema(zod_1.z.object({})),
                },
                {
                    name: 'crear_tarea',
                    description: 'Crea una nueva tarea en un proyecto.',
                    inputSchema: zodToJsonSchema(zod_1.z.object({
                        projectId: zod_1.z.number(),
                        nombre: zod_1.z.string(),
                        descripcion: zod_1.z.string().optional(),
                        prioridad: zod_1.z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']).optional(),
                        estado: zod_1.z.string().optional()
                    })),
                },
                {
                    name: 'modificar_tarea',
                    description: 'Modifica una tarea existente.',
                    inputSchema: zodToJsonSchema(zod_1.z.object({
                        id: zod_1.z.string(),
                        nombre: zod_1.z.string().optional(),
                        descripcion: zod_1.z.string().optional(),
                        prioridad: zod_1.z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']).optional(),
                        estado: zod_1.z.string().optional()
                    })),
                },
                {
                    name: 'crear_documentacion',
                    description: 'Crea un nuevo documento para un proyecto (soporta Markdown).',
                    inputSchema: zodToJsonSchema(zod_1.z.object({
                        projectId: zod_1.z.number(),
                        titulo: zod_1.z.string(),
                        tipo: zod_1.z.enum(['MD', 'LINK', 'FILE']),
                        contenido: zod_1.z.string().optional(),
                        url: zod_1.z.string().optional()
                    })),
                },
                {
                    name: 'modificar_documentacion',
                    description: 'Modifica un documento existente.',
                    inputSchema: zodToJsonSchema(zod_1.z.object({
                        id: zod_1.z.string(),
                        titulo: zod_1.z.string().optional(),
                        contenido: zod_1.z.string().optional(),
                        tipo: zod_1.z.enum(['MD', 'LINK', 'FILE']).optional(),
                        url: zod_1.z.string().optional()
                    })),
                },
                {
                    name: 'listar_tickets',
                    description: 'Obtiene todos los tickets de soporte.',
                    inputSchema: zodToJsonSchema(zod_1.z.object({})),
                },
                {
                    name: 'crear_ticket',
                    description: 'Crea un nuevo ticket de soporte.',
                    inputSchema: zodToJsonSchema(zod_1.z.object({
                        titulo: zod_1.z.string(),
                        mensaje: zod_1.z.string(),
                        categoria: zod_1.z.string().optional(),
                        estado: zod_1.z.string().optional(),
                        usuarioId: zod_1.z.string().optional(),
                    })),
                },
                {
                    name: 'modificar_ticket',
                    description: 'Actualiza un ticket existente (estado, respuestas, etc).',
                    inputSchema: zodToJsonSchema(zod_1.z.object({
                        id: zod_1.z.string(),
                        titulo: zod_1.z.string().optional(),
                        mensaje: zod_1.z.string().optional(),
                        estado: zod_1.z.string().optional(),
                        respuestas: zod_1.z.array(zod_1.z.any()).optional(),
                    })),
                },
            ],
        };
    });
    server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        try {
            if (name === 'listar_proyectos') {
                const projects = await projectsService.findAll(DEFAULT_EMPRESA_ID);
                return { content: [{ type: 'text', text: JSON.stringify(projects) }] };
            }
            if (name === 'crear_proyecto') {
                const project = await projectsService.create(args, DEFAULT_EMPRESA_ID);
                return { content: [{ type: 'text', text: `Creado: ${project.id}` }] };
            }
            if (name === 'listar_tareas') {
                const tasks = await tasksService.findAll(DEFAULT_EMPRESA_ID);
                return { content: [{ type: 'text', text: JSON.stringify(tasks) }] };
            }
            if (name === 'crear_tarea') {
                const { projectId, ...data } = args;
                const task = await tasksService.create(projectId, data, DEFAULT_EMPRESA_ID);
                return { content: [{ type: 'text', text: `Tarea creada: ${task.id}` }] };
            }
            if (name === 'modificar_tarea') {
                const { id, ...data } = args;
                const task = await tasksService.update(id, data, DEFAULT_EMPRESA_ID);
                return { content: [{ type: 'text', text: `Tarea ${id} actualizada` }] };
            }
            if (name === 'crear_documentacion') {
                const { projectId, ...data } = args;
                const doc = await docService.create(projectId, data, DEFAULT_EMPRESA_ID);
                return { content: [{ type: 'text', text: `Documento creado: ${doc.id}` }] };
            }
            if (name === 'modificar_documentacion') {
                const { id, ...data } = args;
                const doc = await docService.update(id, data, DEFAULT_EMPRESA_ID);
                return { content: [{ type: 'text', text: `Documento ${id} actualizado` }] };
            }
            if (name === 'listar_tickets') {
                const tickets = await ticketsService.findAll('', 'ADMIN', DEFAULT_EMPRESA_ID);
                return { content: [{ type: 'text', text: JSON.stringify(tickets) }] };
            }
            if (name === 'crear_ticket') {
                const { usuarioId, ...data } = args;
                const ticket = await ticketsService.create(data, usuarioId || 'admin-system', DEFAULT_EMPRESA_ID);
                return { content: [{ type: 'text', text: `Ticket creado: ${ticket.codigo}` }] };
            }
            if (name === 'modificar_ticket') {
                const { id, ...data } = args;
                const ticket = await ticketsService.update(id, data, DEFAULT_EMPRESA_ID);
                return { content: [{ type: 'text', text: `Ticket ${id} actualizado` }] };
            }
            throw new Error('Tool not found');
        }
        catch (e) {
            return { content: [{ type: 'text', text: e.message }], isError: true };
        }
    });
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
bootstrap().catch(console.error);
//# sourceMappingURL=mcp-server.js.map