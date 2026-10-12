import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Checkin } from '../checkins/entities/checkin.entity';
import { Habit } from '../habits/entities/habit.entity';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const habitsRepository = { findBy: jest.fn() };
  const checkinsRepository = { findBy: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getRepositoryToken(Habit), useValue: habitsRepository },
        { provide: getRepositoryToken(Checkin), useValue: checkinsRepository },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve calcular o resumo do dashboard', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-09T12:00:00.000Z'));

    habitsRepository.findBy.mockResolvedValue([
      {
        id: 1,
        title: 'Caminhada',
        frequency: 'diário',
        weekDays: [0, 1, 2, 3, 4, 5, 6],
      },
      {
        id: 2,
        title: 'Refeição saudável',
        frequency: 'semanal',
        weekDays: [4],
      },
    ]);
    checkinsRepository.findBy.mockResolvedValue([
      { habitId: 1, date: '2026-10-07' },
      { habitId: 1, date: '2026-10-08' },
      { habitId: 1, date: '2026-10-09' },
      { habitId: 2, date: '2026-10-09' },
    ]);

    await expect(service.getDashboard(1)).resolves.toEqual({
      totalHabits: 2,
      weeklyCompletionPercentage: 50,
      weekDays: [
        { label: 'SÁB', completed: false, isToday: false },
        { label: 'DOM', completed: false, isToday: false },
        { label: 'SEG', completed: false, isToday: false },
        { label: 'TER', completed: false, isToday: false },
        { label: 'QUA', completed: true, isToday: false },
        { label: 'QUI', completed: true, isToday: false },
        { label: 'SEX', completed: true, isToday: true },
      ],
      habits: [
        { id: 1, title: 'Caminhada', currentStreak: 3 },
        { id: 2, title: 'Refeição saudável', currentStreak: 1 },
      ],
    });

    jest.useRealTimers();
  });

  it('deve ignorar dias fora da rotina ao calcular o streak', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-12T12:00:00.000Z'));

    habitsRepository.findBy.mockResolvedValue([
      {
        id: 1,
        title: 'Leitura',
        frequency: 'semanal',
        weekDays: [0, 2, 4],
      },
    ]);
    checkinsRepository.findBy.mockResolvedValue([
      { habitId: 1, date: '2026-10-07' },
      { habitId: 1, date: '2026-10-09' },
      { habitId: 1, date: '2026-10-12' },
    ]);

    const dashboard = await service.getDashboard(1);

    expect(dashboard.habits[0].currentStreak).toBe(3);
    jest.useRealTimers();
  });

  it('deve ignorar check-ins antigos fora da rotina', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-09T12:00:00.000Z'));

    habitsRepository.findBy.mockResolvedValue([
      {
        id: 1,
        title: 'Leitura',
        frequency: 'semanal',
        weekDays: [0],
      },
    ]);
    checkinsRepository.findBy.mockResolvedValue([
      { habitId: 1, date: '2026-10-09' },
    ]);

    const dashboard = await service.getDashboard(1);

    expect(dashboard.weeklyCompletionPercentage).toBe(0);
    expect(dashboard.weekDays.at(-1)?.completed).toBe(false);
    jest.useRealTimers();
  });
});
