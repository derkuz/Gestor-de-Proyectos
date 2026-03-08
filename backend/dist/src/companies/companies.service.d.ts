import { Repository } from 'typeorm';
import { Empresa } from '../entities/empresa.entity';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
export declare class CompaniesService {
    private companiesRepository;
    private usersRepository;
    private projectsRepository;
    constructor(companiesRepository: Repository<Empresa>, usersRepository: Repository<User>, projectsRepository: Repository<Project>);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<Empresa>;
    create(data: Partial<Empresa>): Promise<Empresa>;
    update(id: string, data: Partial<Empresa>): Promise<Empresa>;
    toggleStatus(id: string): Promise<Empresa>;
}
