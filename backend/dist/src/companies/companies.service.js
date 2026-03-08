"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const empresa_entity_1 = require("../entities/empresa.entity");
const user_entity_1 = require("../entities/user.entity");
const project_entity_1 = require("../entities/project.entity");
let CompaniesService = class CompaniesService {
    companiesRepository;
    usersRepository;
    projectsRepository;
    constructor(companiesRepository, usersRepository, projectsRepository) {
        this.companiesRepository = companiesRepository;
        this.usersRepository = usersRepository;
        this.projectsRepository = projectsRepository;
    }
    async findAll() {
        const companies = await this.companiesRepository.find();
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
    async findOne(id) {
        const empresa = await this.companiesRepository.findOne({
            where: { id },
            relations: ['usuarios', 'proyectos']
        });
        if (!empresa)
            throw new common_1.NotFoundException('Empresa no encontrada');
        return empresa;
    }
    async create(data) {
        const empresa = this.companiesRepository.create(data);
        return this.companiesRepository.save(empresa);
    }
    async update(id, data) {
        const empresa = await this.findOne(id);
        Object.assign(empresa, data);
        return this.companiesRepository.save(empresa);
    }
    async toggleStatus(id) {
        const empresa = await this.findOne(id);
        empresa.activo = !empresa.activo;
        return this.companiesRepository.save(empresa);
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(empresa_entity_1.Empresa)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map