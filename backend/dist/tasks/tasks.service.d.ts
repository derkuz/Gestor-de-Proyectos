import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { Project } from '../entities/project.entity';
export declare class TasksService {
    private tasksRepository;
    private projectsRepository;
    constructor(tasksRepository: Repository<Task>, projectsRepository: Repository<Project>);
    private checkProjectStatus;
    create(projectId: string, taskData: Partial<Task>): Promise<Task>;
    findAllByProject(projectId: string): Promise<Task[]>;
    findOne(id: string): Promise<Task>;
    update(id: string, updateData: Partial<Task>): Promise<Task>;
    remove(id: string): Promise<void>;
}
