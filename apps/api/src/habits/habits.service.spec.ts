import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HabitsService } from './habits.service';
import { Habit } from './entities/habit.entity';

describe('HabitsService', () => {
  let service: HabitsService;

  const repositoryMock = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabitsService,
        {
          provide: getRepositoryToken(Habit),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<HabitsService>(HabitsService);
  });

  it('deve listar os hábitos', async () => {
    const habits = [
      { id: 1, title: 'Meditação' },
      { id: 2, title: 'Caminhada' },
    ];

    repositoryMock.find.mockResolvedValue(habits);

    const result = await service.findAll();

    expect(result).toEqual(habits);
    expect(repositoryMock.find).toHaveBeenCalledTimes(1);
  });

  it('deve criar um hábito', async () => {
    const dto = {
      title: 'Ler 20 páginas',
      frequency: 'diário',
      category: 'mental',
    };

    const habit = { id: 1, ...dto };

    repositoryMock.create.mockReturnValue(dto);
    repositoryMock.save.mockResolvedValue(habit);

    const result = await service.create(dto);

    expect(repositoryMock.create).toHaveBeenCalledWith(dto);
    expect(repositoryMock.save).toHaveBeenCalledWith(dto);
    expect(result).toEqual(habit);
  });

  it('deve buscar um hábito pelo id', async () => {
    const habit = { id: 1, title: 'Caminhada' };

    repositoryMock.findOneBy.mockResolvedValue(habit);

    const result = await service.findOne(1);

    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(habit);
  });

  it('deve retornar erro quando o hábito não existe', async () => {
    repositoryMock.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow('Hábito não encontrado');
  });

  it('deve atualizar um hábito', async () => {
    const habit = { id: 1, title: 'Caminhada', category: 'saúde' };
    const dto = { title: 'Caminhada de manhã' };

    repositoryMock.findOneBy.mockResolvedValue(habit);
    repositoryMock.save.mockResolvedValue({ ...habit, ...dto });

    const result = await service.update(1, dto);

    expect(repositoryMock.save).toHaveBeenCalledWith({ ...habit, ...dto });
    expect(result).toEqual({ ...habit, ...dto });
  });

  it('deve retornar erro ao atualizar um hábito inexistente', async () => {
    repositoryMock.findOneBy.mockResolvedValue(null);

    await expect(service.update(999, { title: 'Novo título' })).rejects.toThrow(
      'Hábito não encontrado',
    );
  });

  it('deve excluir um hábito', async () => {
    const habit = { id: 1, title: 'Caminhada' };

    repositoryMock.findOneBy.mockResolvedValue(habit);
    repositoryMock.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(1);

    expect(repositoryMock.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: 'Hábito excluído com sucesso' });
  });

  it('deve retornar erro ao excluir um hábito inexistente', async () => {
    repositoryMock.findOneBy.mockResolvedValue(null);

    await expect(service.remove(999)).rejects.toThrow('Hábito não encontrado');
    expect(repositoryMock.delete).not.toHaveBeenCalled();
  });
});
