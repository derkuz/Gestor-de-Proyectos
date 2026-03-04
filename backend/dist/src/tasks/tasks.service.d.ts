import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { Project } from '../entities/project.entity';
export declare class TasksService {
    private tasksRepository;
    private projectsRepository;
    constructor(tasksRepository: Repository<Task>, projectsRepository: Repository<Project>);
    private checkProjectStatus;
    create(projectId: number, taskData: any): Promise<Task>;
    createSubtask(padreId: string, taskData: any): Promise<Task>;
    findAllByProject(projectId: number): Promise<Task[]>;
    findOne(id: string): Promise<Task>;
    update(id: string, updateData: any): Promise<Task>;
    remove(id: string): Promise<void>;
}
