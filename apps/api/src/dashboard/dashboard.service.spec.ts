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
      { id: 1, title: 'Caminhada', frequency: 'diário' },
      { id: 2, title: 'Refeição saudável', frequency: 'semanal' },
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
});
