import { TasksService } from './tasks.service';
import { Task } from '../entities/task.entity';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(projectId: string, taskData: Partial<Task>): Promise<Task>;
    createSubtask(taskId: string, taskData: Partial<Task>): Promise<Task>;
    findAll(projectId: string): Promise<Task[]>;
    findOne(id: string): Promise<Task>;
    update(id: string, updateData: Partial<Task>): Promise<Task>;
    remove(id: string): Promise<void>;
}
