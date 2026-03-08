import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documentation, DocType } from '../entities/documentation.entity';
import { Project } from '../entities/project.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentationService {
    constructor(
        @InjectRepository(Documentation)
        private docRepository: Repository<Documentation>,
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
    ) { }

    async findAllByProject(projectId: number, empresaId: string): Promise<Documentation[]> {
        return this.docRepository.find({
            where: { proyecto: { id: projectId, empresaId } },
            order: { ultimaActualizacion: 'DESC' },
            select: ['id', 'titulo', 'tipo', 'url', 'ultimaActualizacion']
        });
    }

    async findOne(id: string, empresaId: string): Promise<Documentation> {
        const doc = await this.docRepository.findOne({
            where: { id, proyecto: { empresaId } },
            relations: ['proyecto']
        });
        if (!doc) throw new NotFoundException('Documento no encontrado en tu empresa');

        // Si es MD, leer el contenido del archivo físico
        if (doc.tipo === DocType.MD && doc.url) {
            try {
                const filePath = path.resolve('.' + doc.url);
                if (fs.existsSync(filePath)) {
                    (doc as any).contenido = fs.readFileSync(filePath, 'utf8');
                }
            } catch (error) {
                console.error('Error leyendo archivo físico:', error);
            }
        }

        return doc;
    }

    async create(projectId: number, docData: Partial<Documentation>, empresaId: string): Promise<Documentation> {
        const project = await this.projectsRepository.findOne({ where: { id: projectId, empresaId } });
        if (!project) throw new NotFoundException('Proyecto no encontrado en tu empresa');

        const content = (docData as any).contenido;
        const { contenido, ...rest } = docData as any;

        const doc = this.docRepository.create({
            ...rest,
            proyecto: project
        });

        const savedDoc = (await this.docRepository.save(doc)) as unknown as Documentation;

        if (savedDoc.tipo === DocType.MD && content) {
            const currentYear = new Date().getFullYear().toString();
            const relativeDir = `/uploads/proyectos/${currentYear}/${projectId}`;
            const uploadDir = path.resolve('.' + relativeDir);

            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

            const safeTitle = savedDoc.titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const fileName = `${safeTitle}.md`;
            const filePath = path.join(uploadDir, fileName);

            fs.writeFileSync(filePath, content);

            savedDoc.url = `${relativeDir}/${fileName}`;
            await this.docRepository.update(savedDoc.id, { url: savedDoc.url });
            (savedDoc as any).contenido = content;
        }

        return savedDoc;
    }

    async update(id: string, docData: Partial<Documentation>, empresaId: string): Promise<Documentation> {
        const doc = await this.findOne(id, empresaId);
        const project = doc.proyecto;
        const content = (docData as any).contenido;

        const { contenido, ...rest } = docData as any;
        Object.assign(doc, rest);

        const savedDoc = (await this.docRepository.save(doc)) as unknown as Documentation;

        if (savedDoc.tipo === DocType.MD && content !== undefined) {
            const currentYear = new Date().getFullYear().toString();
            const relativeDir = `/uploads/proyectos/${currentYear}/${project.id}`;
            const uploadDir = path.resolve('.' + relativeDir);

            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

            const safeTitle = savedDoc.titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const fileName = `${safeTitle}.md`;
            const filePath = path.join(uploadDir, fileName);

            if (savedDoc.url && savedDoc.url !== `${relativeDir}/${fileName}`) {
                const oldPath = path.resolve('.' + savedDoc.url);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            fs.writeFileSync(filePath, content);
            savedDoc.url = `${relativeDir}/${fileName}`;
            await this.docRepository.update(savedDoc.id, { url: savedDoc.url });
            (savedDoc as any).contenido = content;
        }

        return savedDoc;
    }

    async remove(id: string, empresaId: string): Promise<void> {
        const doc = await this.findOne(id, empresaId);

        if (doc.tipo === DocType.MD && doc.url) {
            try {
                const filePath = path.resolve('.' + doc.url);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (error) {
                console.error('Error eliminando archivo físico:', error);
            }
        }

        await this.docRepository.delete(id);
    }
}
