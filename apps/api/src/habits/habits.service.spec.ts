
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HabitsService } from './habits.service';
import { Habit } from './entities/habit.entity';

describe('HabitsService', () => {
  let service: HabitsService;

  const repositoryMock = {
    find: jest.fn(),
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
});
