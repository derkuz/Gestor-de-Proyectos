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
exports.ActivityLog = void 0;
const typeorm_1 = require("typeorm");
const empresa_entity_1 = require("./empresa.entity");
let ActivityLog = class ActivityLog {
    id;
    accion;
    detalles;
    fecha;
    entidadTipo;
    entidadId;
    duracionMs;
    categoria;
    empresa;
    empresaId;
};
exports.ActivityLog = ActivityLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ActivityLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ActivityLog.prototype, "accion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'detalle', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "detalles", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ActivityLog.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo', nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "entidadTipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "entidadId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duracionms', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ActivityLog.prototype, "duracionMs", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'categoria', default: 'BUSINESS' }),
    __metadata("design:type", String)
], ActivityLog.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empresa_entity_1.Empresa),
    (0, typeorm_1.JoinColumn)({ name: 'empresaId' }),
    __metadata("design:type", empresa_entity_1.Empresa)
], ActivityLog.prototype, "empresa", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ActivityLog.prototype, "empresaId", void 0);
exports.ActivityLog = ActivityLog = __decorate([
    (0, typeorm_1.Entity)('ActivityLog')
], ActivityLog);
//# sourceMappingURL=activity-log.entity.js.map