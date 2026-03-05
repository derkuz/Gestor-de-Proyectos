import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { TicketsService } from './tickets.service';
import { Ticket } from '../entities/ticket.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { getDynamicUploadPath } from '../utils/file-upload.utils';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const ticketId = randomUUID();
                (req as any).ticketId = ticketId;
                const basePath = process.env.TICKETS_UPLOAD_PATH || 'uploads/tickets';
                const path = getDynamicUploadPath(basePath, ticketId);
                cb(null, path);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
    }))
    create(@Body() ticketData: any, @Req() req: any, @UploadedFile() file: Express.Multer.File) {
        const payload = { ...ticketData };
        if (file) {
            const now = new Date();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = String(now.getFullYear());
            const ticketId = (req as any).ticketId;

            payload.id = ticketId; // Usar el mismo ID que la carpeta
            payload.imagenUrl = `/uploads/tickets/${ticketId}/${month}/${year}/${file.filename}`;
        }

        // Map categoriaRelacionadaId if present
        if (ticketData.categoriaRelacionadaId) {
            payload.categoriaRelacionada = { id: ticketData.categoriaRelacionadaId };
            delete payload.categoriaRelacionadaId;
        }

        return this.ticketsService.create(payload, req.user.userId);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.ticketsService.findAll(req.user.userId, req.user.rol);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ticketsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateData: Partial<Ticket>, @Req() req: any) {
        return this.ticketsService.update(id, updateData, req.user.userId, req.user.rol);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.ticketsService.remove(id);
    }
}
