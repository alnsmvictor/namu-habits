import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Checkin } from '../checkins/entities/checkin.entity';
import { Habit } from '../habits/entities/habit.entity';

type DashboardHabit = {
  id: number;
  title: string;
  currentStreak: number;
};

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
    @InjectRepository(Checkin)
    private readonly checkinsRepository: Repository<Checkin>,
  ) {}

  async getDashboard(userId: number) {
    const habits = await this.habitsRepository.findBy({ userId });
    const habitIds = habits.map((habit) => habit.id);
    const checkins = habitIds.length
      ? await this.checkinsRepository.findBy({ habitId: In(habitIds) })
      : [];

    const checkinsByHabit = new Map<number, Set<string>>();

    for (const checkin of checkins) {
      const dates = checkinsByHabit.get(checkin.habitId) ?? new Set<string>();
      dates.add(checkin.date);
      checkinsByHabit.set(checkin.habitId, dates);
    }

    const today = new Date();
    const weekDates = Array.from({ length: 7 }, (_, index) =>
      this.toDateKey(this.addDays(today, -index)),
    );
    const weekStart = weekDates[weekDates.length - 1];

    const expectedCheckins = habits.reduce(
      (total, habit) => total + (habit.frequency === 'semanal' ? 1 : 7),
      0,
    );
    const completedCheckins = habits.reduce((total, habit) => {
      const dates = checkinsByHabit.get(habit.id) ?? new Set<string>();

      return (
        total +
        [...dates].filter(
          (date) => date >= weekStart && weekDates.includes(date),
        ).length
      );
    }, 0);

    const dashboardHabits: DashboardHabit[] = habits.map((habit) => ({
      id: habit.id,
      title: habit.title,
      currentStreak: this.getCurrentStreak(
        checkinsByHabit.get(habit.id) ?? new Set<string>(),
        today,
      ),
    }));

    return {
      totalHabits: habits.length,
      weeklyCompletionPercentage: expectedCheckins
        ? Math.round((completedCheckins / expectedCheckins) * 100)
        : 0,
      weekDays: [...weekDates].reverse().map((date) => ({
        label: this.getDayLabel(date),
        completed: checkins.some((checkin) => checkin.date === date),
        isToday: date === this.toDateKey(today),
      })),
      habits: dashboardHabits,
    };
  }

  private getCurrentStreak(dates: Set<string>, today: Date): number {
    let streak = 0;

    for (let index = 0; ; index += 1) {
      const date = this.toDateKey(this.addDays(today, -index));

      if (!dates.has(date)) {
        return streak;
      }

      streak += 1;
    }
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
  }

  private toDateKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private getDayLabel(date: string): string {
    const labels = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    return labels[new Date(date + 'T12:00:00Z').getUTCDay()];
  }
}
