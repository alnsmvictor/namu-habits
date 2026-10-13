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
      const habit = habits.find((item) => item.id === checkin.habitId);
      const weekDays = habit?.weekDays ?? [0, 1, 2, 3, 4, 5, 6];

      if (!habit || !this.isHabitDay(checkin.date, weekDays)) {
        continue;
      }

      const dates = checkinsByHabit.get(checkin.habitId) ?? new Set<string>();
      dates.add(checkin.date);
      checkinsByHabit.set(checkin.habitId, dates);
    }

    const today = new Date();
    const weekDates = Array.from({ length: 7 }, (_, index) =>
      this.toDateKey(this.addDays(today, -index)),
    );
    const weekStart = weekDates[weekDates.length - 1];

    const expectedCheckins = habits.reduce((total, habit) => {
      const weekDays = habit.weekDays ?? [0, 1, 2, 3, 4, 5, 6];

      return (
        total +
        weekDates.filter((date) => this.isHabitDay(date, weekDays)).length
      );
    }, 0);
    const completedCheckins = habits.reduce((total, habit) => {
      const dates = checkinsByHabit.get(habit.id) ?? new Set<string>();
      const weekDays = habit.weekDays ?? [0, 1, 2, 3, 4, 5, 6];

      return (
        total +
        [...dates].filter(
          (date) =>
            date >= weekStart &&
            weekDates.includes(date) &&
            this.isHabitDay(date, weekDays),
        ).length
      );
    }, 0);

    const dashboardHabits: DashboardHabit[] = habits.map((habit) => ({
      id: habit.id,
      title: habit.title,
      currentStreak: this.getCurrentStreak(
        checkinsByHabit.get(habit.id) ?? new Set<string>(),
        habit.weekDays ?? [0, 1, 2, 3, 4, 5, 6],
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
        completed: [...checkinsByHabit.values()].some((dates) =>
          dates.has(date),
        ),
        isToday: date === this.toDateKey(today),
      })),
      habits: dashboardHabits,
    };
  }

  private getCurrentStreak(
    dates: Set<string>,
    weekDays: number[],
    today: Date,
  ): number {
    let streak = 0;

    for (let index = 0; index < 365; index += 1) {
      const date = this.toDateKey(this.addDays(today, -index));

      if (!this.isHabitDay(date, weekDays)) {
        continue;
      }

      if (!dates.has(date)) {
        return streak;
      }

      streak += 1;
    }

    return streak;
  }

  private isHabitDay(date: string, weekDays: number[]): boolean {
    const day = new Date(date + 'T12:00:00Z').getUTCDay();
    const weekDayIndex = day === 0 ? 6 : day - 1;

    return weekDays.includes(weekDayIndex);
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
