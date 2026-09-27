import { useEffect, useState } from 'react';
import type { GameStats, GameState } from '../types/game';
import { ShareButton } from './ShareButton';
import { getArtworkUrl } from '../services/pokemonApi';

interface ResultCardProps {
  gameState: GameState;
  stats: GameStats;
}

export function ResultCard({ gameState, stats }: ResultCardProps) {
  const won = gameState.won;
  const targetName = gameState.target ?? 'Unknown';
  const [imgError, setImgError] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const artwork = getArtworkUrl(targetName);
  const winPct = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Reveal animation */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className={`relative flex h-40 w-40 items-center justify-center transition-all duration-700 ${
            revealed ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{
              background: won
                ? 'radial-gradient(circle, rgba(255,203,5,0.4), transparent 70%)'
                : 'radial-gradient(circle, rgba(239,68,68,0.3), transparent 70%)',
            }}
          />
          {!imgError && artwork ? (
            <img
              src={artwork}
              alt={targetName}
              className="relative h-40 w-40 object-contain drop-shadow-2xl"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-poke-red/20 text-3xl font-bold capitalize text-poke-red">
              {targetName.slice(0, 3)}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          {won ? (
            <>
              <h2 className="font-display text-2xl font-extrabold text-poke-yellow">
                You got it!
              </h2>
              <p className="text-lg font-bold capitalize" style={{ color: 'var(--text)' }}>
                {targetName}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Found in {gameState.attempts} {gameState.attempts === 1 ? 'guess' : 'guesses'}
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl font-extrabold" style={{ color: 'var(--text)' }}>
                Better luck tomorrow!
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                The Pokémon was{' '}
                <span className="font-bold capitalize" style={{ color: 'var(--text)' }}>
                  {targetName}
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-2 rounded-xl p-3" style={{ background: 'var(--bg-secondary)' }}>
        <ResultStat label="Attempts" value={`${gameState.attempts}/${gameState.maxAttempts}`} />
        <ResultStat label="Win %" value={`${winPct}`} />
        <ResultStat label="Streak" value={stats.currentStreak} />
        <ResultStat label="Max Streak" value={stats.maxStreak} />
      </div>

      {/* Distribution */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
          Guess Distribution
        </h3>
        {(() => {
          const maxDist = Math.max(...stats.distribution, 1);
          return stats.distribution.map((count, i) => {
            const width = count > 0 ? Math.max((count / maxDist) * 100, 8) : 2;
            const hasCount = count > 0;
            const isCurrent = won && i === gameState.attempts - 1;
            return (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-right font-bold tabular-nums" style={{ color: 'var(--text)' }}>
                  {i + 1}
                </span>
                <div className="flex-1 overflow-hidden">
                  <div
                    className="flex items-center justify-end rounded-md px-2 py-1 text-xs font-bold tabular-nums transition-all duration-500"
                    style={{
                      width: `${width}%`,
                      minWidth: hasCount ? '2rem' : '0.5rem',
                      background: isCurrent
                        ? 'linear-gradient(90deg, #ee1515, #c00d0d)'
                        : hasCount
                          ? 'linear-gradient(90deg, #ffcb05, #e0ac00)'
                          : 'var(--border)',
                      color: hasCount ? '#0f1838' : 'var(--text-secondary)',
                    }}
                  >
                    {hasCount ? count : ''}
                  </div>
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* Share */}
      <ShareButton gameState={gameState} won={won} />

      {/* Come back tomorrow */}
      <div className="flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
        <svg className="h-4 w-4 text-poke-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        </svg>
        Come back tomorrow for a new challenge
      </div>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg font-bold tabular-nums" style={{ color: 'var(--text)' }}>
        {value}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
    </div>
  );
}
