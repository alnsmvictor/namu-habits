export type HabitPeriod = 'MANHA' | 'TARDE' | 'NOITE';

export type Habit = {
  id: number;
  title: string;
  period: HabitPeriod;
  completed: boolean;
};

export type UserHabit = {
  id: number;
  title: string;
  description: string | null;
  period: HabitPeriod;
  frequency: string;
  category: string;
  userId: number;
};

export type CreateHabitData = {
  title: string;
  period: HabitPeriod;
  frequency: string;
  category: string;
};

export type DashboardData = {
  weeklyCompletionPercentage: number;
  weekDays: {
    label: string;
    completed: boolean;
    isToday: boolean;
  }[];
};
