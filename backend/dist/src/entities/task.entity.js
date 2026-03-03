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
exports.Task = exports.TaskPriority = void 0;
const typeorm_1 = require("typeorm");
const project_entity_1 = require("./project.entity");
const user_entity_1 = require("./user.entity");
const ticket_entity_1 = require("./ticket.entity");
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["BAJA"] = "BAJA";
    TaskPriority["MEDIA"] = "MEDIA";
    TaskPriority["ALTA"] = "ALTA";
    TaskPriority["CRITICA"] = "CRITICA";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
let Task = class Task {
    id;
    nombre;
    descripcion;
    prioridad;
    estado;
    esSubtarea;
    fechaInicio;
    fechaFin;
    proyecto;
    ticketLigado;
    padre;
    subtareas;
    asignados;
};
exports.Task = Task;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Task.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TaskPriority,
        default: TaskPriority.MEDIA,
    }),
    __metadata("design:type", String)
], Task.prototype, "prioridad", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Pendiente' }),
    __metadata("design:type", String)
], Task.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Task.prototype, "esSubtarea", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Task.prototype, "fechaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Task.prototype, "fechaFin", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, (project) => project.tareas),
    __metadata("design:type", project_entity_1.Project)
], Task.prototype, "proyecto", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => ticket_entity_1.Ticket, ticket => ticket.tareaRelacionada, { nullable: true }),
    __metadata("design:type", ticket_entity_1.Ticket)
], Task.prototype, "ticketLigado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Task, (task) => task.subtareas, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'padreId' }),
    __metadata("design:type", Task)
], Task.prototype, "padre", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task, (task) => task.padre),
    __metadata("design:type", Array)
], Task.prototype, "subtareas", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User),
    (0, typeorm_1.JoinTable)({ name: 'task_assignments' }),
    __metadata("design:type", Array)
], Task.prototype, "asignados", void 0);
exports.Task = Task = __decorate([
    (0, typeorm_1.Entity)()
], Task);
//# sourceMappingURL=task.entity.js.map