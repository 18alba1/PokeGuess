import { API_BASE_URL } from './config';
import type { GameState, GuessResult } from '../types/game';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed (${res.status})${text ? ': ' + text : ''}`);
  }
  const text = await res.text();
  if (!text) {
    throw new Error('Empty response from server');
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export async function startGame(): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/game/start`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });
  const data = await handleResponse<string | { sessionId?: string }>(res);
  if (typeof data === 'string') {
    return data.replace(/^"|"$/g, '');
  }
  if (data && typeof data === 'object' && 'sessionId' in data && data.sessionId) {
    return data.sessionId;
  }
  throw new Error('Invalid start game response');
}

export async function getGameState(sessionId: string): Promise<GameState> {
  const res = await fetch(
    `${API_BASE_URL}/api/game/state?sessionId=${encodeURIComponent(sessionId)}`,
    { headers: { Accept: 'application/json' } },
  );
  return handleResponse<GameState>(res);
}

export async function makeGuess(sessionId: string, name: string): Promise<GuessResult> {
  const res = await fetch(
    `${API_BASE_URL}/api/game/guess?sessionId=${encodeURIComponent(sessionId)}&name=${encodeURIComponent(name)}`,
    { method: 'POST', headers: { Accept: 'application/json' } },
  );
  return handleResponse<GuessResult>(res);
}
