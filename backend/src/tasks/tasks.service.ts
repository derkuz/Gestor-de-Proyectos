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

    private async checkProjectStatus(projectId: string, allowedStatuses: ProjectStatus[] = [ProjectStatus.ACTIVO]) {
        const project = await this.projectsRepository.findOne({ where: { id: projectId } });
        if (!project) throw new NotFoundException('Proyecto no encontrado');
        if (!allowedStatuses.includes(project.estado)) {
            throw new ForbiddenException(`Operación no permitida: el proyecto está en estado ${project.estado}`);
        }
        return project;
    }

    async create(projectId: string, taskData: Partial<Task>): Promise<Task> {
        await this.checkProjectStatus(projectId);
        const task = this.tasksRepository.create({
            ...taskData,
            proyecto: { id: projectId } as Project,
        });
        return this.tasksRepository.save(task);
    }

    async findAllByProject(projectId: string): Promise<Task[]> {
        return this.tasksRepository.find({
            where: { proyecto: { id: projectId } },
            relations: ['subtareas', 'padre'],
        });
    }

    async findOne(id: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { id },
            relations: ['proyecto', 'subtareas', 'padre'],
        });
        if (!task) throw new NotFoundException('Tarea no encontrada');
        return task;
    }

    async update(id: string, updateData: Partial<Task>): Promise<Task> {
        const task = await this.findOne(id);
        await this.checkProjectStatus(task.proyecto.id);

        Object.assign(task, updateData);
        return this.tasksRepository.save(task);
    }

    async remove(id: string): Promise<void> {
        const task = await this.findOne(id);
        await this.checkProjectStatus(task.proyecto.id);
        await this.tasksRepository.remove(task);
    }
}
