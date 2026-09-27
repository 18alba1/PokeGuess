import { useEffect, useRef } from 'react';
import type { GuessResult } from '../types/game';
import { GuessRow } from './GuessRow';

interface GuessGridProps {
  guesses: GuessResult[];
}

const COLUMN_LABELS = ['Pokémon', 'Type', 'Generation', 'Habitat', 'Height', 'Weight', 'Evolution'];

export function GuessGrid({ guesses }: GuessGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (latestRef.current) {
      latestRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [guesses.length]);

  if (guesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-12 px-4 text-center" style={{ borderColor: 'var(--border)' }}>
        <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'var(--bg-secondary)' }}>
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Start guessing to see clues appear here
        </p>
      </div>
    );
  }

  return (
    <div ref={gridRef} className="flex flex-col gap-3">
      {/* Desktop grid */}
      <div className="hidden md:block">
        <div
          className="grid gap-1.5 mb-2 px-1 text-xs font-bold uppercase tracking-wide"
          style={{ color: 'var(--text-secondary)', gridTemplateColumns: '1.5fr 1.2fr 1fr 1.2fr 0.9fr 0.9fr 1fr' }}
        >
          {COLUMN_LABELS.map((label) => (
            <div key={label} className="text-center">{label}</div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          {guesses.map((guess, i) => (
            <div
              key={`${guess.pokemon.name}-${i}`}
              ref={i === guesses.length - 1 ? latestRef : undefined}
              className="grid gap-1.5"
              style={{ gridTemplateColumns: '1.5fr 1.2fr 1fr 1.2fr 0.9fr 0.9fr 1fr' }}
            >
              <GuessRow guess={guess} isLatest={i === guesses.length - 1} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {guesses.map((guess, i) => (
          <div key={`${guess.pokemon.name}-${i}`} ref={i === guesses.length - 1 ? latestRef : undefined}>
            <GuessRow guess={guess} isLatest={i === guesses.length - 1} />
          </div>
        ))}
      </div>
    </div>
  );
}
