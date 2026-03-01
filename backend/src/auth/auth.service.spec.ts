import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    updateResetToken: jest.fn(),
    findByResetToken: jest.fn(),
    updatePassword: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw ConflictException if user exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: '1' });
      await expect(service.register({ email: 't@t.com', password: '123' }))
        .rejects.toThrow(ConflictException);
    });

    it('should register and return login result', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockUsersService.create.mockResolvedValue({ id: '1', email: 't@t.com' });

      const result = await service.register({ email: 't@t.com', password: '123' });
      expect(result).toHaveProperty('access_token');
      expect(mockUsersService.create).toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should return user info if valid', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ email: 't@t.com', password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('t@t.com', '123');
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('t@t.com');
    });

    it('should return null if invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      expect(await service.validateUser('t@t.com', '123')).toBeNull();
    });
  });
});
