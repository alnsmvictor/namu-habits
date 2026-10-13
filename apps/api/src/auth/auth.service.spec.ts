import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;

  const repositoryMock = {
    create: jest.fn(),
    findOneBy: jest.fn(),
    query: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve cadastrar um usuario com senha em hash', async () => {
    const user = {
      id: 1,
      name: 'Victor',
      email: 'victor@email.com',
      passwordHash: 'hash',
    };

    repositoryMock.findOneBy.mockResolvedValue(null);
    repositoryMock.create.mockReturnValue(user);
    repositoryMock.save.mockResolvedValue(user);

    const result = await service.register({
      name: 'Victor',
      email: 'victor@email.com',
      password: '123456',
    });

    expect(repositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Victor',
        email: 'victor@email.com',
        passwordHash: expect.not.stringMatching('123456'),
      }),
    );
    expect(result).toEqual({
      message: 'Conta criada com sucesso',
      user: {
        id: 1,
        name: 'Victor',
        email: 'victor@email.com',
      },
    });
  });

  it('deve retornar o usuario quando a senha estiver correta', async () => {
    const passwordHash = await bcrypt.hash('123456', 10);
    repositoryMock.findOneBy.mockResolvedValue({
      id: 1,
      name: 'Victor',
      email: 'victor@email.com',
      passwordHash,
    });

    const result = await service.login({
      email: 'victor@email.com',
      password: '123456',
    });

    expect(result).toEqual({
      message: 'Login realizado com sucesso',
      user: {
        id: 1,
        name: 'Victor',
        email: 'victor@email.com',
      },
    });
  });

  it('deve rejeitar uma senha invalida', async () => {
    repositoryMock.findOneBy.mockResolvedValue(null);

    await expect(
      service.login({ email: 'victor@email.com', password: '123456' }),
    ).rejects.toThrow(/senha/);
  });

  it('deve alterar a senha quando a senha atual estiver correta', async () => {
    const passwordHash = await bcrypt.hash('123456', 10);
    const user = {
      id: 1,
      name: 'Victor',
      email: 'victor@email.com',
      passwordHash,
    };

    repositoryMock.findOneBy.mockResolvedValue(user);
    repositoryMock.save.mockResolvedValue(user);

    const result = await service.changePassword(1, {
      currentPassword: '123456',
      newPassword: '654321',
    });

    expect(result).toEqual({ message: 'Senha alterada com sucesso' });
    expect(await bcrypt.compare('654321', user.passwordHash)).toBe(true);
  });
});
