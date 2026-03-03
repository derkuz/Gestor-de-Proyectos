import { NestFactory } from '@nestjs/core';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
// @ts-ignore
import { zodToJsonSchema as zodToJsonSchemaFn } from 'zod-to-json-schema';
const zodToJsonSchema = zodToJsonSchemaFn as any;
import { z } from 'zod';
import { AppModule } from './app.module';
import { ProjectsService } from './projects/projects.service';
import { TasksService } from './tasks/tasks.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
    const projectsService = app.get(ProjectsService);
    const tasksService = app.get(TasksService);

    const server = new Server(
        { name: 'gestor-proyectos-mcp', version: '1.0.0' },
        { capabilities: { tools: {} } }
    );

    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: 'listar_proyectos',
                    description: 'Obtiene todos los proyectos.',
                    inputSchema: zodToJsonSchema(z.object({})),
                },
                {
                    name: 'crear_proyecto',
                    description: 'Crea un proyecto.',
                    inputSchema: zodToJsonSchema(z.object({
                        nombre: z.string(),
                        descripcion: z.string().optional()
                    })),
                },
            ],
        };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
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
        } catch (e: any) {
            return { content: [{ type: 'text', text: e.message }], isError: true };
        }
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
}

bootstrap().catch(console.error);
