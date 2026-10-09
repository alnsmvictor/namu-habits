import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Habit } from '../habits/entities/habit.entity';
import { Checkin } from './entities/checkin.entity';
import { CheckinsService } from './checkins.service';

describe('CheckinsService', () => {
  let service: CheckinsService;

  const checkinsRepository = {
    findOneBy: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const habitsRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckinsService,
        { provide: getRepositoryToken(Checkin), useValue: checkinsRepository },
        { provide: getRepositoryToken(Habit), useValue: habitsRepository },
      ],
    }).compile();

    service = module.get<CheckinsService>(CheckinsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve criar um check-in', async () => {
    const dto = { date: '2026-10-09', notes: 'Feito pela manhã' };
    const checkin = { id: 1, habitId: 1, ...dto };

    habitsRepository.findOneBy.mockResolvedValue({ id: 1 });
    checkinsRepository.findOneBy.mockResolvedValue(null);
    checkinsRepository.create.mockReturnValue(checkin);
    checkinsRepository.save.mockResolvedValue(checkin);

    const result = await service.create(1, dto);

    expect(checkinsRepository.create).toHaveBeenCalledWith({ habitId: 1, ...dto });
    expect(result).toEqual(checkin);
  });

  it('deve retornar 404 para hábito inexistente', async () => {
    habitsRepository.findOneBy.mockResolvedValue(null);

    await expect(service.create(999, { date: '2026-10-09' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('deve retornar 409 para check-in duplicado', async () => {
    habitsRepository.findOneBy.mockResolvedValue({ id: 1 });
    checkinsRepository.findOneBy.mockResolvedValue({ id: 1 });

    await expect(service.create(1, { date: '2026-10-09' })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('deve consultar os check-ins de um hábito', async () => {
    const checkins = [{ id: 1, habitId: 1, date: '2026-10-09' }];

    habitsRepository.findOneBy.mockResolvedValue({ id: 1 });
    checkinsRepository.find.mockResolvedValue(checkins);

    const result = await service.findAllByHabit(1);

    expect(checkinsRepository.find).toHaveBeenCalledWith({
      where: { habitId: 1 },
      order: { date: 'DESC' },
    });
    expect(result).toEqual(checkins);
  });
});
