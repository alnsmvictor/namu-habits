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
  currentStreak?: number;
};

export type CreateHabitData = {
  title: string;
  description?: string;
  period: HabitPeriod;
  weekDays: number[];
  frequency: string;
  category: string;
};

export type UpdateHabitData = Partial<CreateHabitData>;

export type DashboardData = {
  weeklyCompletionPercentage: number;
  weekDays: {
    label: string;
    completed: boolean;
    isToday: boolean;
  }[];
  habits: {
    id: number;
    title: string;
    currentStreak: number;
  }[];
};

export type HabitCheckin = {
  id: number;
  habitId: number;
  date: string;
  notes: string | null;
};
