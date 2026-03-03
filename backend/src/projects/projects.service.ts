import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from '../entities/project.entity';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
    ) { }

    async create(projectData: Partial<Project>): Promise<Project> {
        const project = this.projectsRepository.create(projectData);
        return this.projectsRepository.save(project);
    }

    async findAll(): Promise<Project[]> {
        return this.projectsRepository.find({ relations: ['documentos'] });
    }

    async findOne(id: string): Promise<Project> {
        const project = await this.projectsRepository.findOne({
            where: { id },
            relations: ['tareas', 'documentos'],
        });
        if (!project) throw new NotFoundException('Proyecto no encontrado');
        return project;
    }

    async update(id: string, updateData: Partial<Project>): Promise<Project> {
        const project = await this.findOne(id);

        // Logic: If status is FINISHED, it probably shouldn't be moved back to ACTIVO easily without review, 
        // but here we allow standard updates for now as per requirements.

        Object.assign(project, updateData);
        return this.projectsRepository.save(project);
    }

    async remove(id: string): Promise<void> {
        const project = await this.findOne(id);
        await this.projectsRepository.remove(project);
    }
}
