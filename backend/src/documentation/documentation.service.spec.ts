import { Test, TestingModule } from '@nestjs/testing';
import { DocumentationService } from './documentation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Documentation } from '../entities/documentation.entity';
import { Project } from '../entities/project.entity';
import { NotFoundException } from '@nestjs/common';

describe('DocumentationService', () => {
  let service: DocumentationService;
  let docRepo: any;
  let projectRepo: any;

  const mockDocRepo = {
    findOne: jest.fn(),
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(doc => Promise.resolve({ id: 'd1', ...doc })),
  };

  const mockProjectRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentationService,
        { provide: getRepositoryToken(Documentation), useValue: mockDocRepo },
        { provide: getRepositoryToken(Project), useValue: mockProjectRepo },
      ],
    }).compile();

    service = module.get<DocumentationService>(DocumentationService);
    docRepo = module.get(getRepositoryToken(Documentation));
    projectRepo = module.get(getRepositoryToken(Project));
  });

  describe('findByProjectId', () => {
    it('should return documentation if exists', async () => {
      docRepo.findOne.mockResolvedValue({ id: 'd1', contenido: 'test' });
      const result = await service.findByProjectId('p1');
      expect(result.contenido).toBe('test');
    });

    it('should throw NotFoundException if doc not found', async () => {
      docRepo.findOne.mockResolvedValue(null);
      await expect(service.findByProjectId('p1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateByProjectId', () => {
    it('should create new doc if project exists but doc does not', async () => {
      projectRepo.findOne.mockResolvedValue({ id: 'p1' });
      docRepo.findOne.mockResolvedValue(null);

      const result = await service.updateByProjectId('p1', 'nuevo contenido');
      expect(docRepo.create).toHaveBeenCalled();
      expect(result.contenido).toBe('nuevo contenido');
    });
  });
});
