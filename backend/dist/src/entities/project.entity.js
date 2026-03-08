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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = exports.ProjectStatus = void 0;
const typeorm_1 = require("typeorm");
const task_entity_1 = require("./task.entity");
const documentation_entity_1 = require("./documentation.entity");
const user_entity_1 = require("./user.entity");
const empresa_entity_1 = require("./empresa.entity");
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["ACTIVO"] = "ACTIVO";
    ProjectStatus["PAUSADO"] = "PAUSADO";
    ProjectStatus["FINALIZADO"] = "FINALIZADO";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
let Project = class Project {
    id;
    nombre;
    descripcion;
    columnasKanban;
    estado;
    fechaCreacion;
    tareas;
    documentos;
    usuarios;
    empresa;
    empresaId;
};
exports.Project = Project;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Project.prototype, "columnasKanban", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProjectStatus,
        default: ProjectStatus.ACTIVO,
    }),
    __metadata("design:type", String)
], Project.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_entity_1.Task, (task) => task.proyecto),
    __metadata("design:type", Array)
], Project.prototype, "tareas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => documentation_entity_1.Documentation, (doc) => doc.proyecto),
    __metadata("design:type", Array)
], Project.prototype, "documentos", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.proyectos),
    (0, typeorm_1.JoinTable)({ name: 'project_users' }),
    __metadata("design:type", Array)
], Project.prototype, "usuarios", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empresa_entity_1.Empresa, (empresa) => empresa.proyectos),
    __metadata("design:type", empresa_entity_1.Empresa)
], Project.prototype, "empresa", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "empresaId", void 0);
exports.Project = Project = __decorate([
    (0, typeorm_1.Entity)('Project')
], Project);
//# sourceMappingURL=project.entity.js.map