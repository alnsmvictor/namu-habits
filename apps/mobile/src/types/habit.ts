export type HabitPeriod = 'MANHA' | 'TARDE' | 'NOITE';

export type Habit = {
  id: number;
  title: string;
  period: HabitPeriod;
  completed: boolean;
};
