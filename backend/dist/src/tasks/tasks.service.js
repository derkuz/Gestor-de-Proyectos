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
    async checkProjectStatus(projectId, empresaId, allowedStatuses = [project_entity_1.ProjectStatus.ACTIVO]) {
        const project = await this.projectsRepository.findOne({ where: { id: projectId, empresaId } });
        if (!project)
            throw new common_1.NotFoundException('Proyecto no encontrado en tu empresa');
        if (!allowedStatuses.includes(project.estado)) {
            throw new common_1.ForbiddenException(`Operación no permitida: el proyecto está en estado ${project.estado}`);
        }
        return project;
    }
    async create(projectId, taskData, empresaId) {
        await this.checkProjectStatus(projectId, empresaId);
        const { asignados, ...rest } = taskData;
        const task = this.tasksRepository.create({
            ...rest,
            proyecto: { id: projectId },
            esSubtarea: false,
            asignados: asignados?.map((id) => ({ id })),
        });
        return this.tasksRepository.save(task);
    }
    async createSubtask(padreId, taskData, empresaId) {
        const padre = await this.findOne(padreId, empresaId);
        await this.checkProjectStatus(padre.proyecto.id, empresaId);
        const { asignados, ...rest } = taskData;
        const task = this.tasksRepository.create({
            ...rest,
            proyecto: padre.proyecto,
            padre: padre,
            esSubtarea: true,
            asignados: asignados?.map((id) => ({ id })),
        });
        return this.tasksRepository.save(task);
    }
    async findAll(empresaId) {
        return this.tasksRepository.find({
            where: { proyecto: { empresaId } },
            relations: ['proyecto', 'subtareas', 'padre', 'asignados'],
        });
    }
    async findAllByProject(projectId, empresaId) {
        return this.tasksRepository.find({
            where: { proyecto: { id: projectId, empresaId } },
            relations: ['subtareas', 'padre', 'asignados', 'ticketLigado'],
        });
    }
    async findOne(id, empresaId) {
        const task = await this.tasksRepository.findOne({
            where: { id, proyecto: { empresaId } },
            relations: ['proyecto', 'subtareas', 'padre', 'proyecto.tareas', 'asignados'],
        });
        if (!task)
            throw new common_1.NotFoundException('Tarea no encontrada en tu empresa');
        return task;
    }
    async update(id, updateData, empresaId) {
        const task = await this.findOne(id, empresaId);
        await this.checkProjectStatus(task.proyecto.id, empresaId);
        const { asignados, ...rest } = updateData;
        Object.assign(task, rest);
        if (asignados) {
            task.asignados = asignados.map(uid => ({ id: uid }));
        }
        return this.tasksRepository.save(task);
    }
    async remove(id, empresaId) {
        const task = await this.findOne(id, empresaId);
        await this.checkProjectStatus(task.proyecto.id, empresaId);
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