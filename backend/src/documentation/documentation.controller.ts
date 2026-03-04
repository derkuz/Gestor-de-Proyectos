import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentationService } from './documentation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { Documentation, DocType } from '../entities/documentation.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects/:projectId/documentation')
export class DocumentationController {
    constructor(private readonly documentationService: DocumentationService) { }

    @Get()
    findAll(@Param('projectId') projectId: string) {
        return this.documentationService.findAllByProject(+projectId);
    }

    @Post('upload')
    @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.COLABORADOR)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
    }))
    uploadFile(
        @Param('projectId') projectId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body('titulo') titulo: string,
    ) {
        console.log('Backend: Recibida petición de subida', { projectId, titulo, file: file?.filename });
        if (!file) {
            console.error('Backend: No se recibió ningún archivo');
        }
        return this.documentationService.create(+projectId, {
            titulo: titulo || file?.originalname,
            tipo: DocType.FILE,
            url: `/uploads/${file?.filename}`,
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.documentationService.findOne(id);
    }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.COLABORADOR)
    create(@Param('projectId') projectId: string, @Body() docData: Partial<Documentation>) {
        return this.documentationService.create(+projectId, docData);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.COLABORADOR)
    update(@Param('id') id: string, @Body() docData: Partial<Documentation>) {
        return this.documentationService.update(id, docData);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
    remove(@Param('id') id: string) {
        console.log('Backend: Eliminando documento con ID:', id);
        return this.documentationService.remove(id);
    }
}
