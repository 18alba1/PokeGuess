import type { PokemonListResponse, PokemonListEntry } from '../types/game';

const POKEMON_COUNT = 1025;

const LIST_CACHE_KEY = 'pokeguess:pokemon-list';
const LIST_CACHE_TIME = 1000 * 60 * 60 * 24;

interface CachedList {
  timestamp: number;
  data: PokemonListEntry[];
}

let inMemoryList: PokemonListEntry[] | null = null;
const idMap = new Map<string, number>();

export function getArtworkUrlById(id: number | string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getSpriteUrlById(id: number | string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getArtworkUrl(name: string): string | null {
  const id = idMap.get(name.toLowerCase());
  if (id) return getArtworkUrlById(id);
  return null;
}

export function getSpriteUrl(name: string): string | null {
  const id = idMap.get(name.toLowerCase());
  if (id) return getSpriteUrlById(id);
  return null;
}

export async function fetchPokemonList(): Promise<PokemonListEntry[]> {
  if (inMemoryList) return inMemoryList;

  const cached = readCache();
  if (cached) {
    inMemoryList = cached;
    buildIdMap(cached);
    return cached;
  }

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_COUNT}`);
  if (!res.ok) throw new Error('Failed to fetch Pokémon list');
  const data = (await res.json()) as PokemonListResponse;
  const list = data.results;

  inMemoryList = list;
  buildIdMap(list);
  writeCache(list);
  return list;
}

function buildIdMap(list: PokemonListEntry[]) {
  for (const entry of list) {
    const match = entry.url.match(/\/pokemon\/(\d+)\/?$/);
    if (match) {
      idMap.set(entry.name, parseInt(match[1], 10));
    }
  }
}

function readCache(): PokemonListEntry[] | null {
  try {
    const raw = localStorage.getItem(LIST_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedList;
    if (Date.now() - parsed.timestamp > LIST_CACHE_TIME) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(data: PokemonListEntry[]) {
  try {
    const payload: CachedList = { timestamp: Date.now(), data };
    localStorage.setItem(LIST_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota errors
  }
}
