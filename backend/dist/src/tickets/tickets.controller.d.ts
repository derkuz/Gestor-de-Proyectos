import { TicketsService } from './tickets.service';
import { Ticket } from '../entities/ticket.entity';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(ticketData: any, userId: string, empresaId: string, file: Express.Multer.File): Promise<Ticket>;
    findAll(userId: string, role: string, empresaId: string): Promise<Ticket[]>;
    findOne(id: string, empresaId: string): Promise<Ticket>;
    update(id: string, updateData: Partial<Ticket>, empresaId: string, userId: string, role: string): Promise<Ticket>;
    remove(id: string, empresaId: string): Promise<void>;
}
