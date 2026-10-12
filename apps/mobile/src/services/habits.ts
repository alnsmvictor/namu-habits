import {
  CreateHabitData,
  DashboardData,
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
  const response = await fetch(API_URL + '/dashboard', {
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
    const message = Array.isArray(data.message) ? data.message[0] : data.message;
    throw new Error(message || 'Não foi possível criar o hábito');
  }

  return data;
}

export async function updateHabit(
  userId: number,
  habitId: number,
  habit: Pick<CreateHabitData, 'title' | 'period'>,
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

function getToday() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return date.getFullYear() + '-' + month + '-' + day;
}

export async function getTodayCheckins(userId: number, habits: UserHabit[]) {
  const checks = await Promise.all(
    habits.map(async habit => {
      const response = await fetch(
        API_URL + '/habits/' + habit.id + '/checkins',
        { headers: { 'x-user-id': String(userId) } },
      );

      if (!response.ok) {
        return false;
      }

      const checkins = await response.json();
      return checkins.find(
        (checkin: { id: number; date: string }) => checkin.date === getToday(),
      );
    }),
  );

  return habits.reduce<Record<number, number>>((todayCheckins, habit, index) => {
    const checkin = checks[index] as { id: number } | undefined;

    if (checkin) {
      todayCheckins[habit.id] = checkin.id;
    }

    return todayCheckins;
  }, {});
}

export async function createTodayCheckin(userId: number, habitId: number) {
  const response = await fetch(
    API_URL + '/habits/' + habitId + '/checkins',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': String(userId),
      },
      body: JSON.stringify({ date: getToday() }),
    },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Não foi possível concluir o hábito');
  }

  return data as { id: number };
}

export async function removeTodayCheckin(
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
