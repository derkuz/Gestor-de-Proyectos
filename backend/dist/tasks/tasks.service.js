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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("../entities/task.entity");
const project_entity_1 = require("../entities/project.entity");
let TasksService = class TasksService {
    tasksRepository;
    projectsRepository;
    constructor(tasksRepository, projectsRepository) {
        this.tasksRepository = tasksRepository;
        this.projectsRepository = projectsRepository;
    }
    async checkProjectStatus(projectId, allowedStatuses = [project_entity_1.ProjectStatus.ACTIVO]) {
        const project = await this.projectsRepository.findOne({ where: { id: projectId } });
        if (!project)
            throw new common_1.NotFoundException('Proyecto no encontrado');
        if (!allowedStatuses.includes(project.estado)) {
            throw new common_1.ForbiddenException(`Operación no permitida: el proyecto está en estado ${project.estado}`);
        }
        return project;
    }
    async create(projectId, taskData) {
        await this.checkProjectStatus(projectId);
        const task = this.tasksRepository.create({
            ...taskData,
            proyecto: { id: projectId },
        });
        return this.tasksRepository.save(task);
    }
    async findAllByProject(projectId) {
        return this.tasksRepository.find({
            where: { proyecto: { id: projectId } },
            relations: ['subtareas', 'padre'],
        });
    }
    async findOne(id) {
        const task = await this.tasksRepository.findOne({
            where: { id },
            relations: ['proyecto', 'subtareas', 'padre'],
        });
        if (!task)
            throw new common_1.NotFoundException('Tarea no encontrada');
        return task;
    }
    async update(id, updateData) {
        const task = await this.findOne(id);
        await this.checkProjectStatus(task.proyecto.id);
        Object.assign(task, updateData);
        return this.tasksRepository.save(task);
    }
    async remove(id) {
        const task = await this.findOne(id);
        await this.checkProjectStatus(task.proyecto.id);
        await this.tasksRepository.remove(task);
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map