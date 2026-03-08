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
import { getDynamicUploadPath } from '../utils/file-upload.utils';
import { GetUser } from '../auth/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects/:projectId/documentation')
export class DocumentationController {
    constructor(private readonly documentationService: DocumentationService) { }

    @Get()
    findAll(@Param('projectId') projectId: string, @GetUser('empresaId') empresaId: string) {
        return this.documentationService.findAllByProject(+projectId, empresaId);
    }

    @Post('upload')
    @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.COLABORADOR)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const projectId = req.params.projectId as string;
                const basePath = process.env.PROJECTS_UPLOAD_PATH || 'uploads/projects';
                const path = getDynamicUploadPath(basePath, projectId);
                cb(null, path);
            },
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
        @GetUser('empresaId') empresaId: string,
    ) {
        if (!file) throw new Error('No se recibió ningún archivo');
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear());
        const url = `/uploads/projects/${projectId}/${month}/${year}/${file.filename}`;

        return this.documentationService.create(+projectId, {
            titulo: titulo || file?.originalname,
            tipo: DocType.FILE,
            url: url,
        }, empresaId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @GetUser('empresaId') empresaId: string) {
        return this.documentationService.findOne(id, empresaId);
    }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.COLABORADOR)
    create(@Param('projectId') projectId: string, @Body() docData: Partial<Documentation>, @GetUser('empresaId') empresaId: string) {
        return this.documentationService.create(+projectId, docData, empresaId);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.COLABORADOR)
    update(@Param('id') id: string, @Body() docData: Partial<Documentation>, @GetUser('empresaId') empresaId: string) {
        return this.documentationService.update(id, docData, empresaId);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
    remove(@Param('id') id: string, @GetUser('empresaId') empresaId: string) {
        return this.documentationService.remove(id, empresaId);
    }
}
