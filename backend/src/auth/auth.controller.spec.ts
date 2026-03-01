import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register', async () => {
      const userData = { email: 't@t.com', password: '123' };
      mockAuthService.register.mockResolvedValue({ access_token: 'tk' });

      const result = await controller.register(userData);
      expect(service.register).toHaveBeenCalledWith(userData);
      expect(result).toHaveProperty('access_token');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if validation fails', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);
      await expect(controller.login({ email: 't@t.com', password: '123' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should return login result if validation succeeds', async () => {
      const user = { id: '1', email: 't@t.com' };
      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue({ access_token: 'tk' });

      const result = await controller.login({ email: 't@t.com', password: '123' });
      expect(service.login).toHaveBeenCalledWith(user);
      expect(result).toHaveProperty('access_token');
    });
  });
});
