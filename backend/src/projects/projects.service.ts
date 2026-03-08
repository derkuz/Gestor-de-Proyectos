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

    async create(projectData: Partial<Project>, empresaId: string): Promise<Project> {
        const project = this.projectsRepository.create({ ...projectData, empresaId });
        const saved = await this.projectsRepository.save(project);
        await this.activityLogsService.log('CREATE_PROJECT', `Proyecto creado: ${saved.nombre}`, undefined, 'PROJECT', String(saved.id), empresaId);
        return saved;
    }

    async findAll(empresaId: string, isSuperAdmin: boolean = false): Promise<Project[]> {
        const where = isSuperAdmin ? {} : { empresaId };
        return this.projectsRepository.find({
            where,
            relations: ['documentos']
        });
    }

    async findOne(id: number, empresaId: string, isSuperAdmin: boolean = false): Promise<Project> {
        const where = isSuperAdmin ? { id } : { id, empresaId };
        const project = await this.projectsRepository.findOne({
            where: where as any,
            relations: ['tareas', 'documentos', 'usuarios'],
        });
        if (!project) throw new NotFoundException('Proyecto no encontrado');
        return project;
    }

    async update(id: number, updateData: Partial<Project>, empresaId: string): Promise<Project> {
        const project = await this.findOne(id, empresaId);

        Object.assign(project, updateData);
        const saved = await this.projectsRepository.save(project);
        await this.activityLogsService.log('UPDATE_PROJECT', `Proyecto actualizado: ${saved.nombre}`, undefined, 'PROJECT', String(saved.id), empresaId);
        return saved;
    }

    async remove(id: number, empresaId: string): Promise<void> {
        const project = await this.findOne(id, empresaId);
        await this.activityLogsService.log('DELETE_PROJECT', `Proyecto eliminado: ${project.nombre}`, undefined, 'PROJECT', String(project.id), empresaId);
        await this.projectsRepository.remove(project);
    }

    async assignUser(projectId: number, userId: string, empresaId: string): Promise<Project> {
        const project = await this.projectsRepository.findOne({
            where: { id: projectId, empresaId },
            relations: ['usuarios']
        });
        if (!project) throw new NotFoundException('Proyecto no encontrado');

        const user = await this.projectsRepository.manager.findOne(User, { where: { id: userId, empresaId } });
        if (!user) throw new NotFoundException('Usuario no encontrado en tu empresa');

        if (!project.usuarios.some(u => u.id === user.id)) {
            project.usuarios.push(user);
        }

        const saved = await this.projectsRepository.save(project);
        await this.activityLogsService.log('ASSIGN_USER', `Usuario ${user.nombre} asignado al proyecto ${project.nombre}`, undefined, 'PROJECT', String(project.id), empresaId);
        return saved;
    }

    async removeUser(projectId: number, userId: string, empresaId: string): Promise<Project> {
        const project = await this.projectsRepository.findOne({
            where: { id: projectId, empresaId },
            relations: ['usuarios']
        });
        if (!project) throw new NotFoundException('Proyecto no encontrado');

        project.usuarios = project.usuarios.filter(u => u.id !== userId);
        const saved = await this.projectsRepository.save(project);
        await this.activityLogsService.log('REMOVE_USER', `Usuario removido del proyecto ${project.nombre}`, undefined, 'PROJECT', String(project.id), empresaId);
        return saved;
    }

    async getStats(empresaId: string, isSuperAdmin: boolean = false): Promise<any> {
        const where = isSuperAdmin ? {} : { empresaId };
        const projectsCount = await this.projectsRepository.count({ where });

        const tasksQuery = this.projectsRepository.manager
            .createQueryBuilder('task', 'task')
            .innerJoin('task.proyecto', 'project')
            .select("COUNT(*)", "total")
            .addSelect("COUNT(*) FILTER (WHERE LOWER(task.estado) = 'finalizado')", "finalizadas")
            .where("task.esSubtarea = :esSubtarea", { esSubtarea: false });

        if (!isSuperAdmin) {
            tasksQuery.andWhere("project.empresaId = :empresaId", { empresaId });
        }

        const tasksSummary = await tasksQuery.getRawOne();

        const totalTasks = parseInt(tasksSummary.total) || 0;
        const finishedTasks = parseInt(tasksSummary.finalizadas) || 0;
        const progresoGlobal = totalTasks > 0 ? Math.round((finishedTasks / totalTasks) * 100) : 0;

        const projectsWithTasks = await this.projectsRepository.find({
            where,
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

        const ticketsCount = await this.projectsRepository.manager.count('ticket', { where: where as any });

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
