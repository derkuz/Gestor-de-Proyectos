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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ticket_entity_1 = require("../entities/ticket.entity");
const category_entity_1 = require("../entities/category.entity");
let TicketsService = class TicketsService {
    ticketsRepository;
    constructor(ticketsRepository) {
        this.ticketsRepository = ticketsRepository;
    }
    async create(ticketData, userId) {
        let codigo = `TK-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
        if (ticketData.categoriaRelacionada?.id) {
            const category = await this.ticketsRepository.manager.findOne(category_entity_1.Category, {
                where: { id: ticketData.categoriaRelacionada.id },
            });
            if (category && category.prefijo) {
                const count = await this.ticketsRepository.count({
                    where: { categoriaRelacionada: { id: category.id } },
                });
                codigo = `${category.prefijo.toUpperCase()}-${(count + 1).toString().padStart(3, '0')}`;
            }
        }
        const ticket = this.ticketsRepository.create({
            ...ticketData,
            codigo: ticketData.codigo || codigo,
            usuario: { id: userId },
        });
        return this.ticketsRepository.save(ticket);
    }
    async findAll(userId, role) {
        const query = this.ticketsRepository.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.tareaRelacionada', 'tareaRelacionada')
            .leftJoinAndSelect('ticket.usuario', 'usuario')
            .leftJoinAndSelect('ticket.categoriaRelacionada', 'categoriaRelacionada')
            .leftJoin('categoriaRelacionada.usuariosAutorizados', 'autorizado');
        if (role === 'ADMIN') {
        }
        else if (role === 'COLABORADOR') {
            query.where('usuario.id = :userId', { userId })
                .orWhere('autorizado.id = :userId', { userId });
        }
        else {
            query.where('usuario.id = :userId', { userId });
        }
        return query.getMany();
    }
    async findOne(id) {
        const ticket = await this.ticketsRepository.findOne({
            where: { id },
            relations: ['tareaRelacionada', 'usuario', 'categoriaRelacionada', 'categoriaRelacionada.usuariosAutorizados'],
        });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket no encontrado');
        return ticket;
    }
    async update(id, updateData, userId, role) {
        const ticket = await this.findOne(id);
        if (userId && role && role !== 'ADMIN') {
            const isOwner = ticket.usuario?.id === userId;
            const isAuthorizedCollab = role === 'COLABORADOR' &&
                ticket.categoriaRelacionada?.usuariosAutorizados?.some(u => u.id === userId);
            if (!isOwner && !isAuthorizedCollab) {
            }
        }
        Object.assign(ticket, updateData);
        return this.ticketsRepository.save(ticket);
    }
    async remove(id) {
        const ticket = await this.findOne(id);
        await this.ticketsRepository.remove(ticket);
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map