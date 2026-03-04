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

    private async checkProjectStatus(projectId: number, allowedStatuses: ProjectStatus[] = [ProjectStatus.ACTIVO]) {
        const project = await this.projectsRepository.findOne({ where: { id: projectId } });
        if (!project) throw new NotFoundException('Proyecto no encontrado');
        if (!allowedStatuses.includes(project.estado)) {
            throw new ForbiddenException(`Operación no permitida: el proyecto está en estado ${project.estado}`);
        }
        return project;
    }

    async create(projectId: number, taskData: any): Promise<Task> {
        await this.checkProjectStatus(projectId);
        const { asignados, ...rest } = taskData;
        const task = this.tasksRepository.create({
            ...rest,
            proyecto: { id: projectId } as Project,
            esSubtarea: false,
            asignados: asignados?.map((id: any) => ({ id })),
        } as Partial<Task>);
        return this.tasksRepository.save(task);
    }

    async createSubtask(padreId: string, taskData: any): Promise<Task> {
        const padre = await this.findOne(padreId);
        await this.checkProjectStatus(padre.proyecto.id);
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

    async findAllByProject(projectId: number): Promise<Task[]> {
        return this.tasksRepository.find({
            where: { proyecto: { id: projectId } },
            relations: ['subtareas', 'padre', 'asignados', 'ticketLigado'],
        });
    }

    async findOne(id: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { id },
            relations: ['proyecto', 'subtareas', 'padre', 'proyecto.tareas', 'asignados'],
        });
        if (!task) throw new NotFoundException('Tarea no encontrada');
        return task;
    }

    async update(id: string, updateData: any): Promise<Task> {
        const task = await this.findOne(id);
        await this.checkProjectStatus(task.proyecto.id);

        const { asignados, ...rest } = updateData;
        Object.assign(task, rest);

        if (asignados) {
            task.asignados = asignados.map(uid => ({ id: uid }));
        }

        return this.tasksRepository.save(task);
    }

    async remove(id: string): Promise<void> {
        const task = await this.findOne(id);
        await this.checkProjectStatus(task.proyecto.id);
        await this.tasksRepository.remove(task);
    }
}
