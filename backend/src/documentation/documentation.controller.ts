import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { DocumentationService } from './documentation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/documentation')
export class DocumentationController {
    constructor(private readonly documentationService: DocumentationService) { }

    @Get()
    findOne(@Param('projectId') projectId: string) {
        return this.documentationService.findByProjectId(projectId);
    }

    @Patch()
    update(@Param('projectId') projectId: string, @Body('contenido') contenido: string) {
        return this.documentationService.updateByProjectId(projectId, contenido);
    }
}
