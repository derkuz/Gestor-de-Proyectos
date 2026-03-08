import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../entities/task.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post('projects/:projectId/tasks')
    @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
    create(@Param('projectId') projectId: string, @Body() taskData: Partial<Task>, @GetUser('empresaId') empresaId: string) {
        return this.tasksService.create(+projectId, taskData, empresaId);
    }

    @Post('tasks/:taskId/subtasks')
    @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.COLABORADOR)
    createSubtask(@Param('taskId') taskId: string, @Body() taskData: Partial<Task>, @GetUser('empresaId') empresaId: string) {
        return this.tasksService.createSubtask(taskId, taskData, empresaId);
    }

    @Get('projects/:projectId/tasks')
    findAll(@Param('projectId') projectId: string, @GetUser('empresaId') empresaId: string) {
        return this.tasksService.findAllByProject(+projectId, empresaId);
    }

    @Get('tasks/:id')
    findOne(@Param('id') id: string, @GetUser('empresaId') empresaId: string) {
        return this.tasksService.findOne(id, empresaId);
    }

    @Patch('tasks/:id')
    @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.COLABORADOR)
    update(@Param('id') id: string, @Body() updateData: Partial<Task>, @GetUser('empresaId') empresaId: string) {
        return this.tasksService.update(id, updateData, empresaId);
    }

    @Delete('tasks/:id')
    @Roles(UserRole.ADMIN, UserRole.PROJECT_MANAGER)
    remove(@Param('id') id: string, @GetUser('empresaId') empresaId: string) {
        return this.tasksService.remove(id, empresaId);
    }
}
