import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../entities/task.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post('projects/:projectId/tasks')
    create(@Param('projectId') projectId: string, @Body() taskData: Partial<Task>) {
        return this.tasksService.create(projectId, taskData);
    }

    @Get('projects/:projectId/tasks')
    findAll(@Param('projectId') projectId: string) {
        return this.tasksService.findAllByProject(projectId);
    }

    @Get('tasks/:id')
    findOne(@Param('id') id: string) {
        return this.tasksService.findOne(id);
    }

    @Patch('tasks/:id')
    update(@Param('id') id: string, @Body() updateData: Partial<Task>) {
        return this.tasksService.update(id, updateData);
    }

    @Delete('tasks/:id')
    remove(@Param('id') id: string) {
        return this.tasksService.remove(id);
    }
}
