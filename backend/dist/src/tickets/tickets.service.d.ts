import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
export declare class TicketsService {
    private ticketsRepository;
    constructor(ticketsRepository: Repository<Ticket>);
    create(ticketData: any, userId: string, empresaId: string): Promise<Ticket>;
    createWithAttachment(ticketData: any, userId: string, empresaId: string, file?: Express.Multer.File): Promise<Ticket>;
    findAll(userId: string, role: string, empresaId: string): Promise<Ticket[]>;
    findOne(id: string, empresaId: string): Promise<Ticket>;
    update(id: string, updateData: Partial<Ticket>, empresaId: string, userId?: string, role?: string): Promise<Ticket>;
    remove(id: string, empresaId: string): Promise<void>;
}
