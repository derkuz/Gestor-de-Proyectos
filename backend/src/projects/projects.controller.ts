import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from '../entities/project.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
    create(@Body() projectData: Partial<Project>, @GetUser('empresaId') empresaId: string) {
        return this.projectsService.create(projectData, empresaId);
    }

    @Get()
    findAll(@GetUser('empresaId') empresaId: string, @GetUser('rol') rol: UserRole) {
        const isSuperAdmin = rol === UserRole.SUPER_ADMIN;
        return this.projectsService.findAll(empresaId, isSuperAdmin);
    }

    @Get('stats')
    getStats(@GetUser('empresaId') empresaId: string, @GetUser('rol') rol: UserRole) {
        const isSuperAdmin = rol === UserRole.SUPER_ADMIN;
        return this.projectsService.getStats(empresaId, isSuperAdmin);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @GetUser('empresaId') empresaId: string, @GetUser('rol') rol: UserRole) {
        const isSuperAdmin = rol === UserRole.SUPER_ADMIN;
        return this.projectsService.findOne(+id, empresaId, isSuperAdmin);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.SUPER_ADMIN)
    update(@Param('id') id: string, @Body() updateData: Partial<Project>, @GetUser('empresaId') empresaId: string, @GetUser('rol') rol: UserRole) {
        const isSuperAdmin = rol === UserRole.SUPER_ADMIN;
        return this.projectsService.update(+id, updateData, empresaId, isSuperAdmin);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string, @GetUser('empresaId') empresaId: string, @GetUser('rol') rol: UserRole) {
        const isSuperAdmin = rol === UserRole.SUPER_ADMIN;
        return this.projectsService.remove(+id, empresaId, isSuperAdmin);
    }

    @Post(':id/assign')
    @Roles(UserRole.ADMIN)
    assignUser(@Param('id') projectId: string, @Body('userId') userId: string, @GetUser('empresaId') empresaId: string) {
        return this.projectsService.assignUser(+projectId, userId, empresaId);
    }

    @Delete(':id/users/:userId')
    @Roles(UserRole.ADMIN)
    removeUser(@Param('id') projectId: string, @Param('userId') userId: string, @GetUser('empresaId') empresaId: string) {
        return this.projectsService.removeUser(+projectId, userId, empresaId);
    }
}
