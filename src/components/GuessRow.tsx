import { useState } from 'react';
import type { GuessResult } from '../types/game';
import { ClueCell, DirectionCell } from './ClueCell';
import {
  directionMeta,
  evolutionMeta,
  formatGeneration,
  formatHabitat,
  formatHeight,
  formatType,
  formatWeight,
  matchStatusMeta,
} from '../utils/clueHelpers';
import { getArtworkUrl } from '../services/pokemonApi';

interface GuessRowProps {
  guess: GuessResult;
  isLatest: boolean;
}

export function GuessRow({ guess, isLatest }: GuessRowProps) {
  const [imgError, setImgError] = useState(false);
  const pokemon = guess.pokemon;
  const artwork = getArtworkUrl(pokemon.name);
  const baseDelay = isLatest ? 100 : 0;

  return (
    <>
      {/* Desktop: grid row */}
      <div className="hidden md:contents">
        {/* Pokemon cell */}
        <div
          className="flex items-center gap-2 rounded-lg px-2 py-2 animate-reveal-pop"
          style={{ animationDelay: `${baseDelay}ms`, background: 'var(--bg-secondary)' }}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center">
            {!imgError && artwork ? (
              <img
                src={artwork}
                alt={pokemon.name}
                className="h-12 w-12 object-contain"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-poke-red/20 text-xs font-bold text-poke-red">
                {pokemon.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <span className="truncate text-sm font-bold capitalize" style={{ color: 'var(--text)' }}>
            {pokemon.name}
          </span>
        </div>

        <ClueCell meta={matchStatusMeta(guess.type)} value={pokemon.types.map(formatType).join(', ')} delay={baseDelay + 100} />
        <ClueCell meta={matchStatusMeta(guess.generation)} value={formatGeneration(pokemon.generation)} delay={baseDelay + 200} />
        <ClueCell meta={matchStatusMeta(guess.habitat)} value={formatHabitat(pokemon.habitat)} delay={baseDelay + 300} />
        <DirectionCell meta={directionMeta(guess.height)} value={formatHeight(pokemon.height)} delay={baseDelay + 400} />
        <DirectionCell meta={directionMeta(guess.weight)} value={formatWeight(pokemon.weight)} delay={baseDelay + 500} />
        <ClueCell meta={evolutionMeta(guess.evolutionDistance)} delay={baseDelay + 600} />
      </div>

      {/* Mobile: card */}
      <div className="md:hidden animate-slide-up" style={{ animationDelay: `${baseDelay}ms` }}>
        <div className="card overflow-hidden">
          <div className="flex items-center gap-3 border-b px-3 py-2.5" style={{ borderColor: 'var(--border)' }}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center">
              {!imgError && artwork ? (
                <img
                  src={artwork}
                  alt={pokemon.name}
                  className="h-12 w-12 object-contain"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-poke-red/20 text-xs font-bold text-poke-red">
                  {pokemon.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-base font-bold capitalize" style={{ color: 'var(--text)' }}>
              {pokemon.name}
            </span>
            {guess.correct && (
              <span className="ml-auto rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-bold text-green-600">
                Correct!
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-px" style={{ background: 'var(--border)' }}>
            <MobileClue label="Type" meta={matchStatusMeta(guess.type)} subValue={pokemon.types.map(formatType).join(', ')} delay={baseDelay + 100} />
            <MobileClue label="Gen" meta={matchStatusMeta(guess.generation)} subValue={formatGeneration(pokemon.generation)} delay={baseDelay + 200} />
            <MobileClue label="Habitat" meta={matchStatusMeta(guess.habitat)} subValue={formatHabitat(pokemon.habitat)} delay={baseDelay + 300} />
            <MobileClue label="Evolution" meta={evolutionMeta(guess.evolutionDistance)} delay={baseDelay + 400} />
            <MobileDirection label="Height" meta={directionMeta(guess.height)} value={formatHeight(pokemon.height)} delay={baseDelay + 500} />
            <MobileDirection label="Weight" meta={directionMeta(guess.weight)} value={formatWeight(pokemon.weight)} delay={baseDelay + 600} />
          </div>
        </div>
      </div>
    </>
  );
}

function MobileClue({ label, meta, subValue, delay }: { label: string; meta: ReturnType<typeof matchStatusMeta>; subValue?: string; delay: number }) {
  const colorClass = `clue-${meta.color}`;
  return (
    <div className={`flex flex-col items-center justify-center gap-0.5 px-2 py-2.5 ${colorClass} animate-reveal-pop`} style={{ animationDelay: `${delay}ms`, background: 'var(--card)' }}>
      <span className="text-[10px] font-bold uppercase tracking-wide opacity-60">{label}</span>
      <span className="text-base font-bold leading-none" aria-hidden="true">{meta.icon}</span>
      {subValue && <span className="text-[11px] font-semibold leading-tight">{subValue}</span>}
    </div>
  );
}

function MobileDirection({ label, meta, value, delay }: { label: string; meta: ReturnType<typeof directionMeta>; value: string; delay: number }) {
  const colorClass = `clue-${meta.color}`;
  return (
    <div className={`flex flex-col items-center justify-center gap-0.5 px-2 py-2.5 ${colorClass} animate-reveal-pop`} style={{ animationDelay: `${delay}ms`, background: 'var(--card)' }}>
      <span className="text-[10px] font-bold uppercase tracking-wide opacity-60">{label}</span>
      <span className="text-lg font-bold leading-none" aria-hidden="true">{meta.arrow}</span>
      <span className="text-[11px] font-semibold leading-tight">{value}</span>
    </div>
  );
}
