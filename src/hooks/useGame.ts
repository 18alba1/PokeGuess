import { useCallback, useEffect, useState } from 'react';
import { getGameState, makeGuess, startGame } from '../services/gameApi';
import type { GameState, GuessResult } from '../types/game';

const SESSION_KEY = 'pokeguess:session-id';

type Status = 'idle' | 'loading' | 'playing' | 'guessing' | 'won' | 'lost';

interface UseGameState {
  sessionId: string | null;
  gameState: GameState | null;
  status: Status;
  error: string | null;
  start: () => Promise<void>;
  restore: () => Promise<void>;
  guess: (name: string) => Promise<GuessResult | null>;
  reset: () => void;
}

export function useGame(): UseGameState {
  const [sessionId, setSessionId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SESSION_KEY);
    } catch {
      return null;
    }
  });
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const persistSession = (id: string | null) => {
    try {
      if (id) localStorage.setItem(SESSION_KEY, id);
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  };

  const applyState = useCallback((state: GameState) => {
    setGameState(state);
    if (state.gameOver) {
      setStatus(state.won ? 'won' : 'lost');
    } else {
      setStatus('playing');
    }
  }, []);

  const restore = useCallback(async () => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) {
      setStatus('idle');
      return;
    }
    setStatus('loading');
    setError(null);
    try {
      const state = await getGameState(saved);
      setSessionId(saved);
      applyState(state);
    } catch {
      // Session invalid — start fresh
      persistSession(null);
      setSessionId(null);
      setStatus('idle');
    }
  }, [applyState]);

  const start = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const id = await startGame();
      persistSession(id);
      setSessionId(id);
      const state = await getGameState(id);
      applyState(state);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start game');
      setStatus('idle');
    }
  }, [applyState]);

  const guess = useCallback(
    async (name: string): Promise<GuessResult | null> => {
      if (!sessionId || !gameState || gameState.gameOver) return null;
      setStatus('guessing');
      setError(null);
      try {
        const result = await makeGuess(sessionId, name);
        const fresh = await getGameState(sessionId);
        applyState(fresh);
        return result;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to submit guess');
        setStatus(gameState.gameOver ? (gameState.won ? 'won' : 'lost') : 'playing');
        return null;
      }
    },
    [sessionId, gameState, applyState],
  );

  const reset = useCallback(() => {
    persistSession(null);
    setSessionId(null);
    setGameState(null);
    setStatus('idle');
    setError(null);
  }, []);

  useEffect(() => {
    if (sessionId) {
      restore();
    } else {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { sessionId, gameState, status, error, start, restore, guess, reset };
}
