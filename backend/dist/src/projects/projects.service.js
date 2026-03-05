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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("../entities/project.entity");
const user_entity_1 = require("../entities/user.entity");
const activity_logs_service_1 = require("../activity-logs/activity-logs.service");
let ProjectsService = class ProjectsService {
    projectsRepository;
    activityLogsService;
    constructor(projectsRepository, activityLogsService) {
        this.projectsRepository = projectsRepository;
        this.activityLogsService = activityLogsService;
    }
    async create(projectData) {
        const project = this.projectsRepository.create(projectData);
        const saved = await this.projectsRepository.save(project);
        await this.activityLogsService.log('CREATE_PROJECT', `Proyecto creado: ${saved.nombre}`, undefined, 'PROJECT', String(saved.id));
        return saved;
    }
    async findAll() {
        return this.projectsRepository.find({ relations: ['documentos'] });
    }
    async findOne(id) {
        const project = await this.projectsRepository.findOne({
            where: { id },
            relations: ['tareas', 'documentos', 'usuarios'],
        });
        if (!project)
            throw new common_1.NotFoundException('Proyecto no encontrado');
        return project;
    }
    async update(id, updateData) {
        const project = await this.findOne(id);
        Object.assign(project, updateData);
        const saved = await this.projectsRepository.save(project);
        await this.activityLogsService.log('UPDATE_PROJECT', `Proyecto actualizado: ${saved.nombre}`, undefined, 'PROJECT', String(saved.id));
        return saved;
    }
    async remove(id) {
        const project = await this.findOne(id);
        await this.activityLogsService.log('DELETE_PROJECT', `Proyecto eliminado: ${project.nombre}`, undefined, 'PROJECT', String(project.id));
        await this.projectsRepository.remove(project);
    }
    async assignUser(projectId, userId) {
        const project = await this.projectsRepository.findOne({
            where: { id: projectId },
            relations: ['usuarios']
        });
        if (!project)
            throw new common_1.NotFoundException('Proyecto no encontrado');
        const user = await this.projectsRepository.manager.findOne(user_entity_1.User, { where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        if (!project.usuarios.some(u => u.id === user.id)) {
            project.usuarios.push(user);
        }
        const saved = await this.projectsRepository.save(project);
        await this.activityLogsService.log('ASSIGN_USER', `Usuario ${user.nombre} asignado al proyecto ${project.nombre}`, undefined, 'PROJECT', String(project.id));
        return saved;
    }
    async removeUser(projectId, userId) {
        const project = await this.projectsRepository.findOne({
            where: { id: projectId },
            relations: ['usuarios']
        });
        if (!project)
            throw new common_1.NotFoundException('Proyecto no encontrado');
        project.usuarios = project.usuarios.filter(u => u.id !== userId);
        const saved = await this.projectsRepository.save(project);
        await this.activityLogsService.log('REMOVE_USER', `Usuario removido del proyecto ${project.nombre}`, undefined, 'PROJECT', String(project.id));
        return saved;
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        activity_logs_service_1.ActivityLogsService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map