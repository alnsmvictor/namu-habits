export type HabitPeriod = 'MANHA' | 'TARDE' | 'NOITE';

export type UserHabit = {
  id: number;
  title: string;
  description: string | null;
  period: HabitPeriod;
  weekDays: number[];
  frequency: string;
  category: string;
  userId: number;
};

export type CreateHabitData = {
  title: string;
  period: HabitPeriod;
  weekDays: number[];
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

export type HabitCheckin = {
  id: number;
  habitId: number;
  date: string;
  notes: string | null;
};
