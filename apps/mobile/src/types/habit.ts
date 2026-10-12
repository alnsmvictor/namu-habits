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
  frequency: string;
  category: string;
  userId: number;
};
