import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { Project, ProjectStatus } from '../entities/project.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
    ) { }

    private async checkProjectStatus(projectId: number, empresaId: string, allowedStatuses: ProjectStatus[] = [ProjectStatus.ACTIVO]) {
        const project = await this.projectsRepository.findOne({ where: { id: projectId, empresaId } });
        if (!project) throw new NotFoundException('Proyecto no encontrado en tu empresa');
        if (!allowedStatuses.includes(project.estado)) {
            throw new ForbiddenException(`Operación no permitida: el proyecto está en estado ${project.estado}`);
        }
        return project;
    }

    async create(projectId: number, taskData: any, empresaId: string): Promise<Task> {
        await this.checkProjectStatus(projectId, empresaId);
        const { asignados, ...rest } = taskData;
        const task = this.tasksRepository.create({
            ...rest,
            proyecto: { id: projectId } as Project,
            esSubtarea: false,
            asignados: asignados?.map((id: any) => ({ id })),
        } as Partial<Task>);
        return this.tasksRepository.save(task);
    }

    async createSubtask(padreId: string, taskData: any, empresaId: string): Promise<Task> {
        const padre = await this.findOne(padreId, empresaId);
        await this.checkProjectStatus(padre.proyecto.id, empresaId);
        const { asignados, ...rest } = taskData;
        const task = this.tasksRepository.create({
            ...rest,
            proyecto: padre.proyecto,
            padre: padre,
            esSubtarea: true,
            asignados: asignados?.map((id: any) => ({ id })),
        } as Partial<Task>);
        return this.tasksRepository.save(task);
    }

    async findAll(empresaId: string): Promise<Task[]> {
        return this.tasksRepository.find({
            where: { proyecto: { empresaId } },
            relations: ['proyecto', 'subtareas', 'padre', 'asignados'],
        });
    }

    async findAllByProject(projectId: number, empresaId: string): Promise<Task[]> {
        return this.tasksRepository.find({
            where: { proyecto: { id: projectId, empresaId } },
            relations: ['subtareas', 'padre', 'asignados', 'ticketLigado'],
        });
    }

    async findOne(id: string, empresaId: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { id, proyecto: { empresaId } },
            relations: ['proyecto', 'subtareas', 'padre', 'proyecto.tareas', 'asignados'],
        });
        if (!task) throw new NotFoundException('Tarea no encontrada en tu empresa');
        return task;
    }

    async update(id: string, updateData: any, empresaId: string): Promise<Task> {
        const task = await this.findOne(id, empresaId);
        await this.checkProjectStatus(task.proyecto.id, empresaId);

        const { asignados, ...rest } = updateData;
        Object.assign(task, rest);

        if (asignados) {
            task.asignados = asignados.map(uid => ({ id: uid }));
        }

        return this.tasksRepository.save(task);
    }

    async remove(id: string, empresaId: string): Promise<void> {
        const task = await this.findOne(id, empresaId);
        await this.checkProjectStatus(task.proyecto.id, empresaId);
        await this.tasksRepository.remove(task);
    }
}
