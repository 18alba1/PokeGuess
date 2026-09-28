import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  getGameState,
  makeGuess,
  startGame,
} from '../services/gameApi';

import type {
  GameState,
  GuessResult,
} from '../types/game';

const SESSION_KEY =
  'pokeguess:session-id:v2';

const SESSION_DATE_KEY =
  'pokeguess:session-date:v2';

type Status =
  | 'idle'
  | 'loading'
  | 'playing'
  | 'guessing'
  | 'won'
  | 'lost';

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

function getStockholmDate(): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm',
  }).format(new Date());
}

export function useGame(): UseGameState {

  const [sessionId, setSessionId] =
    useState<string | null>(() => {
      try {
        return localStorage.getItem(SESSION_KEY);
      } catch {
        return null;
      }
    });

  const [gameState, setGameState] =
    useState<GameState | null>(null);

  const [status, setStatus] =
    useState<Status>('idle');

  const [error, setError] =
    useState<string | null>(null);

  const currentDateRef =
    useRef(getStockholmDate());

  const rolloverInProgressRef =
    useRef(false);

  const persistSession = (
    id: string | null
  ) => {
    try {
      if (id) {
        localStorage.setItem(
          SESSION_KEY,
          id
        );
      } else {
        localStorage.removeItem(
          SESSION_KEY
        );
      }
    } catch {
      // Ignore localStorage errors
    }
  };

  const persistSessionDate = (
    date: string | null
  ) => {
    try {
      if (date) {
        localStorage.setItem(
          SESSION_DATE_KEY,
          date
        );
      } else {
        localStorage.removeItem(
          SESSION_DATE_KEY
        );
      }
    } catch {
      // Ignore localStorage errors
    }
  };

  const applyState = useCallback(
    (state: GameState) => {

      setGameState(state);

      if (state.gameOver) {
        setStatus(
          state.won
            ? 'won'
            : 'lost'
        );
      } else {
        setStatus('playing');
      }
    },
    []
  );

  const start = useCallback(
    async () => {

      setStatus('loading');
      setError(null);

      try {

        const id =
          await startGame();

        const today =
          getStockholmDate();

        persistSession(id);
        persistSessionDate(today);

        setSessionId(id);

        const state =
          await getGameState(id);

        currentDateRef.current =
          today;

        applyState(state);

      } catch (e) {

        setError(
          e instanceof Error
            ? e.message
            : 'Failed to start game'
        );

        setStatus('idle');
      }
    },
    [applyState]
  );

  const restore = useCallback(
    async () => {

      let saved: string | null = null;
      let savedDate: string | null = null;

      try {

        saved =
          localStorage.getItem(
            SESSION_KEY
          );

        savedDate =
          localStorage.getItem(
            SESSION_DATE_KEY
          );

      } catch {
        saved = null;
        savedDate = null;
      }

      const today =
        getStockholmDate();

      /*
       * No saved game, or the saved game
       * belongs to an older day.
       */
      if (
        !saved ||
        savedDate !== today
      ) {

        persistSession(null);
        persistSessionDate(null);
        setSessionId(null);

        await start();

        return;
      }

      setStatus('loading');
      setError(null);

      try {

        const state =
          await getGameState(saved);

        setSessionId(saved);

        currentDateRef.current =
          today;

        applyState(state);

      } catch {

        /*
         * Invalid/expired session.
         * Start a fresh daily game.
         */
        persistSession(null);
        persistSessionDate(null);

        setSessionId(null);

        await start();
      }
    },
    [applyState, start]
  );

  const guess = useCallback(
    async (
      name: string
    ): Promise<GuessResult | null> => {

      if (
        !sessionId ||
        !gameState ||
        gameState.gameOver
      ) {
        return null;
      }

      setStatus('guessing');
      setError(null);

      try {

        const result =
          await makeGuess(
            sessionId,
            name
          );

        const fresh =
          await getGameState(sessionId);

        applyState(fresh);

        return result;

      } catch (e) {

        setError(
          e instanceof Error
            ? e.message
            : 'Failed to submit guess'
        );

        setStatus(
          gameState.gameOver
            ? gameState.won
              ? 'won'
              : 'lost'
            : 'playing'
        );

        return null;
      }
    },
    [
      sessionId,
      gameState,
      applyState,
    ]
  );

  const reset = useCallback(() => {

    persistSession(null);
    persistSessionDate(null);

    setSessionId(null);
    setGameState(null);
    setStatus('idle');
    setError(null);

  }, []);

  /*
   * Initial restore/start.
   */
  useEffect(() => {

    if (sessionId) {
      restore();
    } else {
      start();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * Detect Stockholm midnight.
   *
   * We don't use a 24-hour timer.
   * The calendar date itself determines
   * when the new game starts.
   */
  useEffect(() => {

    const timer =
      window.setInterval(() => {

        const today =
          getStockholmDate();

        if (
          today ===
          currentDateRef.current
        ) {
          return;
        }

        if (
          rolloverInProgressRef.current
        ) {
          return;
        }

        rolloverInProgressRef.current =
          true;

        /*
         * Mark the new day immediately so
         * we don't start multiple sessions.
         */
        currentDateRef.current =
          today;

        start().finally(() => {
          rolloverInProgressRef.current =
            false;
        });

      }, 1000);

    return () => {
      window.clearInterval(timer);
    };

  }, [start]);

  return {
    sessionId,
    gameState,
    status,
    error,
    start,
    restore,
    guess,
    reset,
  };
}