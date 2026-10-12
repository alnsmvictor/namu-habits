import { UserHabit } from '../types/habit';
import { API_URL } from './auth';

export async function getHabits(userId: number): Promise<UserHabit[]> {
  const response = await fetch(`${API_URL}/habits`, {
    headers: { 'x-user-id': String(userId) },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Não foi possível carregar os hábitos');
  }

  return data;
}
