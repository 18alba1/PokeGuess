import type { GameStats } from '../types/game';

const STATS_KEY = 'pokeguess:stats';
const SHARE_INDEX_KEY = 'pokeguess:share-index';

const DEFAULT_STATS: GameStats = {
  played: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: new Array(10).fill(0),
  lastPlayedDate: null,
  lastWonDate: null,
};

export function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(raw) as Partial<GameStats>;
    return {
      ...DEFAULT_STATS,
      ...parsed,
      distribution: Array.isArray(parsed.distribution)
        ? parsed.distribution.length === 10
          ? parsed.distribution
          : new Array(10).fill(0).map((_, i) => parsed.distribution?.[i] ?? 0)
        : new Array(10).fill(0),
    };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function isConsecutiveDay(prev: string | null, today: string): boolean {
  if (!prev) return false;
  const prevDate = new Date(prev + 'T00:00:00');
  const todayDate = new Date(today + 'T00:00:00');
  const diff = Math.round((todayDate.getTime() - prevDate.getTime()) / 86400000);
  return diff === 1;
}

export function recordGameResult(won: boolean, attempts: number): GameStats {
  const stats = loadStats();
  const today = todayKey();

  // Prevent duplicate same-day games from inflating stats
  if (stats.lastPlayedDate === today) {
    return stats;
  }

  const updated: GameStats = {
    ...stats,
    played: stats.played + 1,
    lastPlayedDate: today,
  };

  if (won) {
    updated.wins = stats.wins + 1;
    updated.lastWonDate = today;

    if (isConsecutiveDay(stats.lastWonDate, today)) {
      updated.currentStreak = stats.currentStreak + 1;
    } else {
      updated.currentStreak = 1;
    }
    updated.maxStreak = Math.max(stats.maxStreak, updated.currentStreak);

    const idx = Math.min(Math.max(attempts - 1, 0), 9);
    updated.distribution = [...stats.distribution];
    updated.distribution[idx] = (updated.distribution[idx] ?? 0) + 1;
  } else {
    updated.currentStreak = 0;
  }

  saveStats(updated);
  return updated;
}

export function getShareIndex(): number {
  try {
    const raw = localStorage.getItem(SHARE_INDEX_KEY);
    const current = raw ? parseInt(raw, 10) : 0;
    const next = current + 1;
    localStorage.setItem(SHARE_INDEX_KEY, String(next));
    return next;
  } catch {
    return Math.floor(Math.random() * 1000) + 1;
  }
}
