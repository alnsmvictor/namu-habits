import { API_URL } from '../config/api';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  message: string;
  user: AuthUser;
};

async function request(path: string, body: object): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message[0]
      : data.message;
    throw new Error(
      message || 'N\u00e3o foi poss\u00edvel concluir a opera\u00e7\u00e3o',
    );
  }

  return data;
}

export function login(email: string, password: string) {
  return request('/auth/login', { email, password });
}

export function register(name: string, email: string, password: string) {
  return request('/auth/register', { name, email, password });
}
