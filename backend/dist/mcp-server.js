"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const zodToJsonSchemaPkg = __importStar(require("zod-to-json-schema"));
const zodToJsonSchema = zodToJsonSchemaPkg.default || zodToJsonSchemaPkg;
const zod_1 = require("zod");
const app_module_1 = require("./app.module");
const projects_service_1 = require("./projects/projects.service");
const tasks_service_1 = require("./tasks/tasks.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, { logger: false });
    const projectsService = app.get(projects_service_1.ProjectsService);
    const tasksService = app.get(tasks_service_1.TasksService);
    const server = new index_js_1.Server({
        name: 'gestor-proyectos-mcp',
        version: '1.0.0',
    }, {
        capabilities: {
            tools: {},
        },
    });
    server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: 'listar_proyectos',
                    description: 'Obtiene la lista de todos los proyectos registrados.',
                    inputSchema: zodToJsonSchema(zod_1.z.object({})),
                },
                {
                    name: 'crear_proyecto',
                    description: 'Crea un nuevo proyecto en el sistema.',
                    inputSchema: zodToJsonSchema(zod_1.z.object({
                        nombre: zod_1.z.string().describe('Nombre del proyecto'),
                        descripcion: zod_1.z.string().optional().describe('Descripción breve del proyecto'),
                    })),
                },
                {
                    name: 'listar_tareas',
                    description: 'Obtiene las tareas asociadas a un proyecto específico.',
                    inputSchema: zodToJsonSchema(zod_1.z.object({
                        projectId: zod_1.z.string().describe('ID UUID del proyecto'),
                    })),
                },
                {
                    name: 'crear_tarea',
                    description: 'Crea una nueva tarea dentro de un proyecto activo.',
                    inputSchema: zodToJsonSchema(zod_1.z.object({
                        projectId: zod_1.z.string().describe('ID UUID del proyecto'),
                        titulo: zod_1.z.string().describe('Título de la tarea'),
                        prioridad: zod_1.z.number().optional().describe('Prioridad (1-5)'),
                    })),
                },
            ],
        };
    });
    server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        try {
            switch (name) {
                case 'listar_proyectos': {
                    const projects = await projectsService.findAll();
                    return {
                        content: [{ type: 'text', text: JSON.stringify(projects, null, 2) }],
                    };
                }
                case 'crear_proyecto': {
                    const { nombre, descripcion } = args;
                    const project = await projectsService.create({ nombre, descripcion });
                    return {
                        content: [{ type: 'text', text: `Proyecto creado con éxito: ${project.id}` }],
                    };
                }
                case 'listar_tareas': {
                    const { projectId } = args;
                    const tasks = await tasksService.findAllByProject(projectId);
                    return {
                        content: [{ type: 'text', text: JSON.stringify(tasks, null, 2) }],
                    };
                }
                case 'crear_tarea': {
                    const { projectId, titulo, prioridad } = args;
                    const task = await tasksService.create(projectId, { titulo, prioridad });
                    return {
                        content: [{ type: 'text', text: `Tarea creada con éxito: ${task.id}` }],
                    };
                }
                default:
                    throw new Error(`Herramienta no encontrada: ${name}`);
            }
        }
        catch (error) {
            return {
                content: [{ type: 'text', text: `Error: ${error.message}` }],
                isError: true,
            };
        }
    });
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    process.on('SIGINT', async () => {
        await app.close();
        process.exit(0);
    });
}
bootstrap().catch((error) => {
    console.error('MCP Server Error:', error);
    process.exit(1);
});
//# sourceMappingURL=mcp-server.js.map