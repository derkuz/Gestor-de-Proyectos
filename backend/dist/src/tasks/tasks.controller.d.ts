import { TasksService } from './tasks.service';
import { Task } from '../entities/task.entity';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(projectId: string, taskData: Partial<Task>, empresaId: string): Promise<Task>;
    createSubtask(taskId: string, taskData: Partial<Task>, empresaId: string): Promise<Task>;
    findAll(projectId: string, empresaId: string): Promise<Task[]>;
    findOne(id: string, empresaId: string): Promise<Task>;
    update(id: string, updateData: Partial<Task>, empresaId: string): Promise<Task>;
    remove(id: string, empresaId: string): Promise<void>;
}
