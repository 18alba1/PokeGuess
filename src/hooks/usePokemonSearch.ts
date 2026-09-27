import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPokemonList } from '../services/pokemonApi';
import type { PokemonListEntry } from '../types/game';

export interface SearchResult {
  name: string;
  id: number;
}

export function usePokemonSearch() {
  const [allPokemon, setAllPokemon] = useState<PokemonListEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idMapRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    let cancelled = false;
    fetchPokemonList()
      .then((list) => {
        if (cancelled) return;
        const map = new Map<string, number>();
        for (const entry of list) {
          const match = entry.url.match(/\/pokemon\/(\d+)\/?$/);
          if (match) map.set(entry.name, parseInt(match[1], 10));
        }
        idMapRef.current = map;
        setAllPokemon(list);
        setLoaded(true);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load Pokémon list');
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const search = useCallback(
    (query: string, limit = 8): SearchResult[] => {
      const q = query.toLowerCase().trim();
      if (!q) return [];
      const results: SearchResult[] = [];
      for (const entry of allPokemon) {
        if (entry.name.startsWith(q)) {
          const id = idMapRef.current.get(entry.name);
          if (id) results.push({ name: entry.name, id });
          if (results.length >= limit) break;
        }
      }
      // If we haven't filled the limit, also match "contains"
      if (results.length < limit) {
        for (const entry of allPokemon) {
          if (entry.name.startsWith(q)) continue;
          if (entry.name.includes(q)) {
            const id = idMapRef.current.get(entry.name);
            if (id) results.push({ name: entry.name, id });
            if (results.length >= limit) break;
          }
        }
      }
      return results;
    },
    [allPokemon],
  );

  const getId = useCallback((name: string): number | undefined => {
    return idMapRef.current.get(name.toLowerCase());
  }, []);

  const isValidName = useCallback(
    (name: string): boolean => {
      return idMapRef.current.has(name.toLowerCase().trim());
    },
    [],
  );

  return { loaded, error, search, getId, isValidName };
}
