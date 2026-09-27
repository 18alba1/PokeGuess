import { useEffect, useMemo, useRef, useState } from 'react';
import { usePokemonSearch, type SearchResult } from '../hooks/usePokemonSearch';
import { getArtworkUrlById } from '../services/pokemonApi';

interface PokemonSearchProps {
  onGuess: (name: string) => void;
  disabled: boolean;
  submitting: boolean;
  guessedNames: Set<string>;
}

export function PokemonSearch({ onGuess, disabled, submitting, guessedNames }: PokemonSearchProps) {
  const { loaded, error: listError, search, isValidName } = usePokemonSearch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useMemo(
    () => {
      return (q: string) => {
        if (debounceTimer) clearTimeout(debounceTimer);
        const timer = setTimeout(() => {
          const r = search(q, 8);
          setResults(r);
          setActiveIndex(-1);
        }, 150);
        setDebounceTimer(timer);
      };
    },
    [search, debounceTimer],
  );

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  const handleChange = (value: string) => {
    setQuery(value);
    setSelected(null);
    if (value.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
    debouncedSearch(value);
  };

  const selectResult = (result: SearchResult) => {
    setSelected(result);
    setQuery(result.name);
    setIsOpen(false);
    setResults([]);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    const name = selected?.name ?? query.trim().toLowerCase();
    if (!name || disabled || submitting) return;
    if (!isValidName(name)) return;
    if (guessedNames.has(name.toLowerCase())) return;
    onGuess(name);
    setQuery('');
    setSelected(null);
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && activeIndex >= 0 && activeIndex < results.length) {
        selectResult(results[activeIndex]);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    } else if (e.key === 'Tab' && isOpen && activeIndex >= 0) {
      selectResult(results[activeIndex]);
    }
  };

  const showList = isOpen && results.length > 0;
  const showNoResults = isOpen && query.trim().length > 0 && results.length === 0 && !selected;
  const alreadyGuessed = selected ? guessedNames.has(selected.name.toLowerCase()) : false;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        {/* Search input */}
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            style={{ color: 'var(--text-secondary)' }}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 150)}
            disabled={disabled}
            placeholder={loaded ? 'Search for a Pokémon...' : 'Loading Pokémon...'}
            aria-label="Search for a Pokémon to guess"
            aria-expanded={showList}
            aria-controls="pokemon-suggestions"
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
            className="w-full rounded-xl border-2 py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all disabled:opacity-50"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
            autoComplete="off"
            spellCheck={false}
          />
          {submitting && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-5 w-5 animate-spin-slow rounded-full border-2 border-transparent border-t-poke-yellow" />
            </div>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showList && (
          <div
            ref={listRef}
            id="pokemon-suggestions"
            role="listbox"
            className="pokemon-scroll absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border-2 shadow-xl animate-fade-in"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            {results.map((result, i) => {
              const guessed = guessedNames.has(result.name.toLowerCase());
              return (
                <button
                  key={result.name}
                  id={`suggestion-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectResult(result);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                    i === activeIndex ? 'bg-poke-yellow/10' : ''
                  } ${guessed ? 'opacity-40' : ''}`}
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <img
                    src={getArtworkUrlById(result.id)}
                    alt=""
                    className="h-10 w-10 shrink-0 object-contain"
                    loading="lazy"
                  />
                  <span className="flex-1 text-sm font-semibold capitalize" style={{ color: 'var(--text)' }}>
                    {highlightMatch(result.name, query)}
                  </span>
                  {guessed && (
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Already guessed
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {showNoResults && (
          <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border-2 px-4 py-3 text-sm shadow-xl animate-fade-in" style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            No Pokémon found for "{query}"
          </div>
        )}

        {listError && (
          <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border-2 border-poke-red/30 px-4 py-3 text-sm shadow-xl animate-fade-in" style={{ background: 'var(--card)' }}>
            <span className="text-poke-red font-medium">Couldn't load Pokémon list. Retrying...</span>
          </div>
        )}
      </div>

      {/* Selected preview + guess button */}
      {selected && (
        <div className="flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 animate-slide-up" style={{ background: 'var(--card)', borderColor: alreadyGuessed ? 'rgba(239,68,68,0.4)' : 'rgba(255,203,5,0.4)' }}>
          <img
            src={getArtworkUrlById(selected.id)}
            alt={selected.name}
            className="h-14 w-14 shrink-0 object-contain"
          />
          <div className="flex-1">
            <span className="text-base font-bold capitalize" style={{ color: 'var(--text)' }}>
              {selected.name}
            </span>
            {alreadyGuessed && (
              <span className="block text-xs font-medium text-poke-red">
                You already guessed this one
              </span>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={disabled || submitting || alreadyGuessed}
            className="btn btn-primary text-sm"
          >
            {submitting ? 'Checking...' : 'Guess'}
          </button>
        </div>
      )}

      {/* Guess button when typing a valid name without selection */}
      {!selected && query.trim() && isValidName(query.trim().toLowerCase()) && !guessedNames.has(query.trim().toLowerCase()) && (
        <button
          onClick={handleSubmit}
          disabled={disabled || submitting}
          className="btn btn-primary text-sm"
        >
          {submitting ? 'Checking...' : `Guess "${query.trim()}"`}
        </button>
      )}
    </div>
  );
}

function highlightMatch(name: string, query: string): React.ReactNode {
  const q = query.toLowerCase().trim();
  if (!q) return name;
  const idx = name.indexOf(q);
  if (idx === -1) return name;
  return (
    <>
      {name.slice(0, idx)}
      <span className="font-bold text-poke-yellow">{name.slice(idx, idx + q.length)}</span>
      {name.slice(idx + q.length)}
    </>
  );
}
