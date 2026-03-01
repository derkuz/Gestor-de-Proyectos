import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Project, ProjectStatus } from '../entities/project.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepo: any;
  let projectRepo: any;

  const mockTaskRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(task => Promise.resolve({ id: 't1', ...task })),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockProjectRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockTaskRepo },
        { provide: getRepositoryToken(Project), useValue: mockProjectRepo },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepo = module.get(getRepositoryToken(Task));
    projectRepo = module.get(getRepositoryToken(Project));
  });

  describe('create', () => {
    it('should throw ForbiddenException if project is PAUSADO', async () => {
      mockProjectRepo.findOne.mockResolvedValue({ id: 'p1', estado: ProjectStatus.PAUSADO });
      await expect(service.create('p1', { titulo: 'T1' })).rejects.toThrow(ForbiddenException);
    });

    it('should create task if project is ACTIVO', async () => {
      mockProjectRepo.findOne.mockResolvedValue({ id: 'p1', estado: ProjectStatus.ACTIVO });
      const result = await service.create('p1', { titulo: 'T1' });
      expect(result.titulo).toBe('T1');
      expect(taskRepo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should throw ForbiddenException if project is FINALIZADO', async () => {
      mockTaskRepo.findOne.mockResolvedValue({ id: 't1', proyecto: { id: 'p1' } });
      mockProjectRepo.findOne.mockResolvedValue({ id: 'p1', estado: ProjectStatus.FINALIZADO });

      await expect(service.update('t1', { titulo: 'New' })).rejects.toThrow(ForbiddenException);
    });
  });
});
