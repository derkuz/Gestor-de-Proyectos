
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from '../entities/empresa.entity';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Empresa)
        private companiesRepository: Repository<Empresa>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
    ) { }

    async findAll(): Promise<any[]> {
        const companies = await this.companiesRepository.find();

        // Sumamos estadísticas básicas para el panel
        const result = await Promise.all(companies.map(async (empresa) => {
            const userCount = await this.usersRepository.count({ where: { empresaId: empresa.id } });
            const projectCount = await this.projectsRepository.count({ where: { empresaId: empresa.id } });

            return {
                ...empresa,
                stats: {
                    users: userCount,
                    projects: projectCount
                }
            };
        }));

        return result;
    }

    async findOne(id: string): Promise<Empresa> {
        const empresa = await this.companiesRepository.findOne({
            where: { id },
            relations: ['usuarios', 'proyectos']
        });
        if (!empresa) throw new NotFoundException('Empresa no encontrada');
        return empresa;
    }

    async create(data: Partial<Empresa>): Promise<Empresa> {
        const empresa = this.companiesRepository.create(data);
        return this.companiesRepository.save(empresa);
    }

    async update(id: string, data: Partial<Empresa>): Promise<Empresa> {
        const empresa = await this.findOne(id);
        Object.assign(empresa, data);
        return this.companiesRepository.save(empresa);
    }

    async toggleStatus(id: string): Promise<Empresa> {
        const empresa = await this.findOne(id);
        empresa.activo = !empresa.activo;
        return this.companiesRepository.save(empresa);
    }
}
