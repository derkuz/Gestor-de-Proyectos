import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { Project } from '../entities/project.entity';
export declare class TasksService {
    private tasksRepository;
    private projectsRepository;
    constructor(tasksRepository: Repository<Task>, projectsRepository: Repository<Project>);
    private checkProjectStatus;
    create(projectId: number, taskData: any, empresaId: string): Promise<Task>;
    createSubtask(padreId: string, taskData: any, empresaId: string): Promise<Task>;
    findAll(empresaId: string): Promise<Task[]>;
    findAllByProject(projectId: number, empresaId: string): Promise<Task[]>;
    findOne(id: string, empresaId: string): Promise<Task>;
    update(id: string, updateData: any, empresaId: string): Promise<Task>;
    remove(id: string, empresaId: string): Promise<void>;
}
