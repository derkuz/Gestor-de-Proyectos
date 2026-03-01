import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from '../entities/ticket.entity';
import { NotFoundException } from '@nestjs/common';

describe('TicketsService', () => {
  let service: TicketsService;
  let repo: any;

  const mockRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(ticket => Promise.resolve({ id: 'tk1', ...ticket })),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: getRepositoryToken(Ticket), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    repo = module.get(getRepositoryToken(Ticket));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
});
