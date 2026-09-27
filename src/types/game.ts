export type MatchStatus = 'MATCH' | 'CLOSE' | 'NO_MATCH';

export type Direction = 'MATCH' | 'UP' | 'DOWN';

export interface Pokemon {
  name: string;
  height: number;
  weight: number;
  types: string[];
  generation: string;
  habitat: string;
  evolutionChainId: number;
}

export interface GuessResult {
  pokemon: Pokemon;
  type: MatchStatus;
  generation: MatchStatus;
  habitat: MatchStatus;
  height: Direction;
  weight: Direction;
  evolutionDistance: number | null;
  correct: boolean;
}

export interface GameState {
  attempts: number;
  maxAttempts: number;
  remainingAttempts: number;
  won: boolean;
  gameOver: boolean;
  target: string | null;
  guesses: GuessResult[];
}

export interface PokemonListEntry {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  results: PokemonListEntry[];
}

export interface GameStats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  distribution: number[];
  lastPlayedDate: string | null;
  lastWonDate: string | null;
}

export type ThemePreference = 'system' | 'light' | 'dark';

export interface AppSettings {
  theme: ThemePreference;
  colorblindMode: boolean;
  reducedMotion: boolean;
  sound: boolean;
}
