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
exports.Empresa = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const project_entity_1 = require("./project.entity");
const ticket_entity_1 = require("./ticket.entity");
const category_entity_1 = require("./category.entity");
const activity_log_entity_1 = require("./activity-log.entity");
let Empresa = class Empresa {
    id;
    nombre;
    cuit;
    plan;
    fechaRegistro;
    activo;
    usuarios;
    proyectos;
    tickets;
    categorias;
    logs;
};
exports.Empresa = Empresa;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Empresa.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Empresa.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], Empresa.prototype, "cuit", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'BASIC' }),
    __metadata("design:type", String)
], Empresa.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Empresa.prototype, "fechaRegistro", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Empresa.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.empresa),
    __metadata("design:type", Array)
], Empresa.prototype, "usuarios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => project_entity_1.Project, (project) => project.empresa),
    __metadata("design:type", Array)
], Empresa.prototype, "proyectos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_1.Ticket, (ticket) => ticket.empresa),
    __metadata("design:type", Array)
], Empresa.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => category_entity_1.Category, (category) => category.empresa),
    __metadata("design:type", Array)
], Empresa.prototype, "categorias", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activity_log_entity_1.ActivityLog, (log) => log.empresa),
    __metadata("design:type", Array)
], Empresa.prototype, "logs", void 0);
exports.Empresa = Empresa = __decorate([
    (0, typeorm_1.Entity)('Empresa')
], Empresa);
//# sourceMappingURL=empresa.entity.js.map