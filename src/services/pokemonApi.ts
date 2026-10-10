import type {
  Pokemon,
  PokemonListResponse,
  PokemonListEntry,
} from '../types/game';
import { API_BASE_URL } from './config';

const LIST_CACHE_KEY = 'pokeguess:pokemon-list:v2';
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

export async function fetchPokemonId(name: string): Promise<number> {
  const response = await fetch(
    `${API_BASE_URL}/pokemon/list`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Pokémon list');
  }

  const data = (await response.json()) as PokemonListResponse;
  const pokemon = data.results.find(
    (entry) => entry.name.toLowerCase() === name.toLowerCase()
  );

  if (!pokemon) {
    throw new Error(`Pokémon not found: ${name}`);
  }

  const match = pokemon.url.match(/\/pokemon\/(\d+)\/?$/);

  if (!match) {
    throw new Error(`Could not determine Pokémon ID: ${name}`);
  }

  return Number(match[1]);
}

export function getSpriteUrlById(id: number | string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getArtworkUrl(name: string): string | null {
  const id = idMap.get(name.toLowerCase());
  if (id) return getArtworkUrlById(id);
  return null;
}

export async function fetchPokemonDetails(
  name: string
): Promise<Pokemon> {
  const response = await fetch(
    `${API_BASE_URL}/pokemon/${encodeURIComponent(name)}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Pokémon details: ${name}`
    );
  }

  return response.json() as Promise<Pokemon>;
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

  const res = await fetch(`${API_BASE_URL}/pokemon/list`);
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
  }
}
