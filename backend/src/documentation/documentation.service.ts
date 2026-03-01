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

    async findByProjectId(projectId: string): Promise<Documentation> {
        const doc = await this.docRepository.findOne({
            where: { proyecto: { id: projectId } },
        });
        if (!doc) throw new NotFoundException('Documentación no encontrada para este proyecto');
        return doc;
    }

    async updateByProjectId(projectId: string, contenido: string): Promise<Documentation> {
        const project = await this.projectsRepository.findOne({ where: { id: projectId } });
        if (!project) throw new NotFoundException('Proyecto no encontrado');

        let doc = await this.docRepository.findOne({ where: { proyecto: { id: projectId } } });
        if (!doc) {
            doc = this.docRepository.create({ contenido, proyecto: project });
        } else {
            doc.contenido = contenido;
        }
        return this.docRepository.save(doc);
    }
}
