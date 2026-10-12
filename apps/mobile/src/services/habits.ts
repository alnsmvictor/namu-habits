import {
  CreateHabitData,
  DashboardData,
  HabitCheckin,
  UpdateHabitData,
  UserHabit,
} from '../types/habit';
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

export async function getDashboard(userId: number): Promise<DashboardData> {
  const response = await fetch(API_URL + '/habits/dashboard', {
    headers: { 'x-user-id': String(userId) },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Não foi possível carregar o resumo');
  }

  return data;
}

export async function createHabit(
  userId: number,
  habit: CreateHabitData,
): Promise<UserHabit> {
  const response = await fetch(`${API_URL}/habits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': String(userId),
    },
    body: JSON.stringify(habit),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message[0]
      : data.message;
    throw new Error(message || 'Não foi possível criar o hábito');
  }

  return data;
}

export async function updateHabit(
  userId: number,
  habitId: number,
  habit: UpdateHabitData,
): Promise<UserHabit> {
  const response = await fetch(API_URL + '/habits/' + habitId, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': String(userId),
    },
    body: JSON.stringify(habit),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Não foi possível atualizar o hábito');
  }

  return data;
}

export async function getCheckins(userId: number, habits: UserHabit[]) {
  const checkins = await Promise.all(
    habits.map(async habit => {
      const response = await fetch(
        API_URL + '/habits/' + habit.id + '/checkins',
        { headers: { 'x-user-id': String(userId) } },
      );

      if (!response.ok) {
        return [];
      }

      return response.json() as Promise<HabitCheckin[]>;
    }),
  );

  return checkins.flat();
}

export async function createCheckin(
  userId: number,
  habitId: number,
  date: string,
): Promise<HabitCheckin> {
  const response = await fetch(API_URL + '/habits/' + habitId + '/checkins', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': String(userId),
    },
    body: JSON.stringify({ date }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Não foi possível concluir o hábito');
  }

  return data as HabitCheckin;
}

export async function removeCheckin(
  userId: number,
  habitId: number,
  checkinId: number,
) {
  const response = await fetch(
    API_URL + '/habits/' + habitId + '/checkins/' + checkinId,
    {
      method: 'DELETE',
      headers: { 'x-user-id': String(userId) },
    },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Não foi possível desmarcar o hábito');
  }
}

export async function deleteHabit(userId: number, habitId: number) {
  const response = await fetch(API_URL + '/habits/' + habitId, {
    method: 'DELETE',
    headers: { 'x-user-id': String(userId) },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Não foi possível excluir o hábito');
  }
}
