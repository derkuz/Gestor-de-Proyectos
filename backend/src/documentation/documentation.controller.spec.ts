import { Test, TestingModule } from '@nestjs/testing';
import { DocumentationController } from './documentation.controller';
import { DocumentationService } from './documentation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('DocumentationController', () => {
  let controller: DocumentationController;
  let service: DocumentationService;

  const mockService = {
    findByProjectId: jest.fn(),
    updateByProjectId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentationController],
      providers: [
        { provide: DocumentationService, useValue: mockService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DocumentationController>(DocumentationController);
    service = module.get<DocumentationService>(DocumentationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
