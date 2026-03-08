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
exports.Ticket = void 0;
const typeorm_1 = require("typeorm");
const task_entity_1 = require("./task.entity");
const user_entity_1 = require("./user.entity");
const category_entity_1 = require("./category.entity");
const empresa_entity_1 = require("./empresa.entity");
let Ticket = class Ticket {
    id;
    codigo;
    titulo;
    categoria;
    categoriaRelacionada;
    mensaje;
    imagenUrl;
    estado;
    respuestas;
    fechaCreacion;
    tareaRelacionada;
    usuario;
    empresa;
    empresaId;
};
exports.Ticket = Ticket;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Ticket.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Ticket.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ticket.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Soporte General' }),
    __metadata("design:type", String)
], Ticket.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, (category) => category.tickets, { nullable: true }),
    __metadata("design:type", category_entity_1.Category)
], Ticket.prototype, "categoriaRelacionada", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Ticket.prototype, "mensaje", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "imagenUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'ABIERTO' }),
    __metadata("design:type", String)
], Ticket.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, default: [] }),
    __metadata("design:type", Object)
], Ticket.prototype, "respuestas", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Ticket.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => task_entity_1.Task, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", task_entity_1.Task)
], Ticket.prototype, "tareaRelacionada", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.tickets),
    __metadata("design:type", user_entity_1.User)
], Ticket.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empresa_entity_1.Empresa, (empresa) => empresa.tickets),
    __metadata("design:type", empresa_entity_1.Empresa)
], Ticket.prototype, "empresa", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ticket.prototype, "empresaId", void 0);
exports.Ticket = Ticket = __decorate([
    (0, typeorm_1.Entity)('Ticket')
], Ticket);
//# sourceMappingURL=ticket.entity.js.map