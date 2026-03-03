import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documentation } from '../entities/documentation.entity';
import { Project } from '../entities/project.entity';

@Injectable()
export class DocumentationService {
    constructor(
        @InjectRepository(Documentation)
        private docRepository: Repository<Documentation>,
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
    ) { }

    async findAllByProject(projectId: string): Promise<Documentation[]> {
        return this.docRepository.find({
            where: { proyecto: { id: projectId } },
            order: { ultimaActualizacion: 'DESC' }
        });
    }

    async findOne(id: string): Promise<Documentation> {
        const doc = await this.docRepository.findOne({
            where: { id },
            relations: ['proyecto']
        });
        if (!doc) throw new NotFoundException('Documento no encontrado');
        return doc;
    }

    async create(projectId: string, docData: Partial<Documentation>): Promise<Documentation> {
        const project = await this.projectsRepository.findOne({ where: { id: projectId } });
        if (!project) throw new NotFoundException('Proyecto no encontrado');

        const doc = this.docRepository.create({
            ...docData,
            proyecto: project
        });
        return this.docRepository.save(doc);
    }

    async update(id: string, docData: Partial<Documentation>): Promise<Documentation> {
        const doc = await this.findOne(id);
        Object.assign(doc, docData);
        return this.docRepository.save(doc);
    }

    async remove(id: string): Promise<void> {
        const result = await this.docRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Documento no encontrado');
        }
    }
}
