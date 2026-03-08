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
import { DocumentationService } from './documentation/documentation.service';
import { TicketsService } from './tickets/tickets.service';


// Redirigir stdout a stderr temporalmente para evitar que logs de Nest/TypeORM rompan el protocolo JSON-RPC de MCP
const originalStdoutWrite = process.stdout.write;
(process.stdout as any).write = function (...args: any[]) {
    const chunk = args[0];
    if (typeof chunk === 'string' && (chunk.startsWith('{') || chunk.trim().startsWith('{'))) {
        return originalStdoutWrite.apply(process.stdout, args);
    }
    return process.stderr.write.apply(process.stderr, args);
};

async function bootstrap() {
    // Silenciar advertencias de pg (DeprecationWarning)
    process.env.NODE_NO_WARNINGS = '1';

    const app = await NestFactory.createApplicationContext(AppModule, {
        logger: false,
    });

    // Asegurarse de que TypeORM no loguee a stdout
    const projectsService = app.get(ProjectsService);
    const tasksService = app.get(TasksService);
    const docService = app.get(DocumentationService);
    const ticketsService = app.get(TicketsService);

    const server = new Server(
        { name: 'gestor-proyectos-mcp', version: '1.0.0' },
        { capabilities: { tools: {} } }
    );

    const DEFAULT_EMPRESA_ID = 'd2b5a5b5-5b5b-4b5b-8b5b-5b5b5b5b5b5b';

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
                {
                    name: 'listar_tareas',
                    description: 'Obtiene todas las tareas asociadas a los proyectos.',
                    inputSchema: zodToJsonSchema(z.object({})),
                },
                {
                    name: 'crear_tarea',
                    description: 'Crea una nueva tarea en un proyecto.',
                    inputSchema: zodToJsonSchema(z.object({
                        projectId: z.number(),
                        nombre: z.string(),
                        descripcion: z.string().optional(),
                        prioridad: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']).optional(),
                        estado: z.string().optional()
                    })),
                },
                {
                    name: 'modificar_tarea',
                    description: 'Modifica una tarea existente.',
                    inputSchema: zodToJsonSchema(z.object({
                        id: z.string(),
                        nombre: z.string().optional(),
                        descripcion: z.string().optional(),
                        prioridad: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']).optional(),
                        estado: z.string().optional()
                    })),
                },
                {
                    name: 'crear_documentacion',
                    description: 'Crea un nuevo documento para un proyecto (soporta Markdown).',
                    inputSchema: zodToJsonSchema(z.object({
                        projectId: z.number(),
                        titulo: z.string(),
                        tipo: z.enum(['MD', 'LINK', 'FILE']),
                        contenido: z.string().optional(),
                        url: z.string().optional()
                    })),
                },
                {
                    name: 'modificar_documentacion',
                    description: 'Modifica un documento existente.',
                    inputSchema: zodToJsonSchema(z.object({
                        id: z.string(),
                        titulo: z.string().optional(),
                        contenido: z.string().optional(),
                        tipo: z.enum(['MD', 'LINK', 'FILE']).optional(),
                        url: z.string().optional()
                    })),
                },
                {
                    name: 'listar_tickets',
                    description: 'Obtiene todos los tickets de soporte.',
                    inputSchema: zodToJsonSchema(z.object({})),
                },
                {
                    name: 'crear_ticket',
                    description: 'Crea un nuevo ticket de soporte.',
                    inputSchema: zodToJsonSchema(z.object({
                        titulo: z.string(),
                        mensaje: z.string(),
                        categoria: z.string().optional(),
                        estado: z.string().optional(),
                        usuarioId: z.string().optional(),
                    })),
                },
                {
                    name: 'modificar_ticket',
                    description: 'Actualiza un ticket existente (estado, respuestas, etc).',
                    inputSchema: zodToJsonSchema(z.object({
                        id: z.string(),
                        titulo: z.string().optional(),
                        mensaje: z.string().optional(),
                        estado: z.string().optional(),
                        respuestas: z.array(z.any()).optional(),
                    })),
                },
            ],
        };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
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
        } catch (e: any) {
            return { content: [{ type: 'text', text: e.message }], isError: true };
        }
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
}

bootstrap().catch(console.error);
