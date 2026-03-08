import { CompaniesService } from './companies.service';
import { Empresa } from '../entities/empresa.entity';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<Empresa>;
    create(data: Partial<Empresa>): Promise<Empresa>;
    update(id: string, data: Partial<Empresa>): Promise<Empresa>;
    toggleStatus(id: string): Promise<Empresa>;
}
