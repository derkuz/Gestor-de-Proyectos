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
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, { logger: false });
    const projectsService = app.get(projects_service_1.ProjectsService);
    const tasksService = app.get(tasks_service_1.TasksService);
    const server = new index_js_1.Server({ name: 'gestor-proyectos-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });
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
            ],
        };
    });
    server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        try {
            if (name === 'listar_proyectos') {
                const projects = await projectsService.findAll();
                return { content: [{ type: 'text', text: JSON.stringify(projects) }] };
            }
            if (name === 'crear_proyecto') {
                const project = await projectsService.create(args);
                return { content: [{ type: 'text', text: `Creado: ${project.id}` }] };
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