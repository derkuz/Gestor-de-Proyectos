import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from '../entities/project.entity';
import { User } from '../entities/user.entity';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
        private activityLogsService: ActivityLogsService,
    ) { }

    async create(projectData: Partial<Project>): Promise<Project> {
        const project = this.projectsRepository.create(projectData);
        const saved = await this.projectsRepository.save(project);
        await this.activityLogsService.log('CREATE_PROJECT', `Proyecto creado: ${saved.nombre}`, undefined, 'PROJECT', String(saved.id));
        return saved;
    }

    async findAll(): Promise<Project[]> {
        return this.projectsRepository.find({ relations: ['documentos'] });
    }

    async findOne(id: number): Promise<Project> {
        const project = await this.projectsRepository.findOne({
            where: { id },
            relations: ['tareas', 'documentos', 'usuarios'],
        });
        if (!project) throw new NotFoundException('Proyecto no encontrado');
        return project;
    }

    async update(id: number, updateData: Partial<Project>): Promise<Project> {
        const project = await this.findOne(id);

        // Logic: If status is FINISHED, it probably shouldn't be moved back to ACTIVO easily without review, 
        // but here we allow standard updates for now as per requirements.

        Object.assign(project, updateData);
        const saved = await this.projectsRepository.save(project);
        await this.activityLogsService.log('UPDATE_PROJECT', `Proyecto actualizado: ${saved.nombre}`, undefined, 'PROJECT', String(saved.id));
        return saved;
    }

    async remove(id: number): Promise<void> {
        const project = await this.findOne(id);
        await this.activityLogsService.log('DELETE_PROJECT', `Proyecto eliminado: ${project.nombre}`, undefined, 'PROJECT', String(project.id));
        await this.projectsRepository.remove(project);
    }

    async assignUser(projectId: number, userId: string): Promise<Project> {
        const project = await this.projectsRepository.findOne({
            where: { id: projectId },
            relations: ['usuarios']
        });
        if (!project) throw new NotFoundException('Proyecto no encontrado');

        const user = await this.projectsRepository.manager.findOne(User, { where: { id: userId } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        if (!project.usuarios.some(u => u.id === user.id)) {
            project.usuarios.push(user);
        }

        const saved = await this.projectsRepository.save(project);
        await this.activityLogsService.log('ASSIGN_USER', `Usuario ${user.nombre} asignado al proyecto ${project.nombre}`, undefined, 'PROJECT', String(project.id));
        return saved;
    }

    async removeUser(projectId: number, userId: string): Promise<Project> {
        const project = await this.projectsRepository.findOne({
            where: { id: projectId },
            relations: ['usuarios']
        });
        if (!project) throw new NotFoundException('Proyecto no encontrado');

        project.usuarios = project.usuarios.filter(u => u.id !== userId);
        const saved = await this.projectsRepository.save(project);
        await this.activityLogsService.log('REMOVE_USER', `Usuario removido del proyecto ${project.nombre}`, undefined, 'PROJECT', String(project.id));
        return saved;
    }

    async getStats(): Promise<any> {
        const projectsCount = await this.projectsRepository.count();

        // 1. Cálculo de progreso GLOBAL basado en Tareas Principales (RF-09)
        const tasksSummary = await this.projectsRepository.manager
            .createQueryBuilder('task', 'task')
            .select("COUNT(*)", "total")
            .addSelect("COUNT(*) FILTER (WHERE LOWER(task.estado) = 'finalizado')", "finalizadas")
            .where("task.esSubtarea = :esSubtarea", { esSubtarea: false })
            .getRawOne();

        const totalTasks = parseInt(tasksSummary.total) || 0;
        const finishedTasks = parseInt(tasksSummary.finalizadas) || 0;
        const progresoGlobal = totalTasks > 0 ? Math.round((finishedTasks / totalTasks) * 100) : 0;

        // 2. Cálculo de progreso POR PROYECTO
        const projectsWithTasks = await this.projectsRepository.find({
            relations: ['tareas'],
        });

        const proyectosDetalle = projectsWithTasks.map(p => {
            const tareasPrincipales = p.tareas.filter(t => !t.esSubtarea);
            const total = tareasPrincipales.length;
            const finalizadas = tareasPrincipales.filter(t => t.estado.toLowerCase() === 'finalizado').length;
            const progreso = total > 0 ? Math.round((finalizadas / total) * 100) : 0;

            return {
                id: p.id,
                nombre: p.nombre,
                estado: p.estado,
                totalTareas: total,
                tareasFinalizadas: finalizadas,
                progreso
            };
        });

        // 3. Conteo de tickets
        const ticketsCount = await this.projectsRepository.manager.count('ticket');

        return {
            proyectos: projectsCount,
            totalTareasPrincipales: totalTasks,
            tareasFinalizadas: finishedTasks,
            progresoGlobal,
            tickets: ticketsCount,
            proyectosDetalle
        };
    }
}
