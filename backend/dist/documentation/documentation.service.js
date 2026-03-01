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
exports.DocumentationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const documentation_entity_1 = require("../entities/documentation.entity");
const project_entity_1 = require("../entities/project.entity");
let DocumentationService = class DocumentationService {
    docRepository;
    projectsRepository;
    constructor(docRepository, projectsRepository) {
        this.docRepository = docRepository;
        this.projectsRepository = projectsRepository;
    }
    async findByProjectId(projectId) {
        const doc = await this.docRepository.findOne({
            where: { proyecto: { id: projectId } },
        });
        if (!doc)
            throw new common_1.NotFoundException('Documentación no encontrada para este proyecto');
        return doc;
    }
    async updateByProjectId(projectId, contenido) {
        const project = await this.projectsRepository.findOne({ where: { id: projectId } });
        if (!project)
            throw new common_1.NotFoundException('Proyecto no encontrado');
        let doc = await this.docRepository.findOne({ where: { proyecto: { id: projectId } } });
        if (!doc) {
            doc = this.docRepository.create({ contenido, proyecto: project });
        }
        else {
            doc.contenido = contenido;
        }
        return this.docRepository.save(doc);
    }
};
exports.DocumentationService = DocumentationService;
exports.DocumentationService = DocumentationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(documentation_entity_1.Documentation)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DocumentationService);
//# sourceMappingURL=documentation.service.js.map