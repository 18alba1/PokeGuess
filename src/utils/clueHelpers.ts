import type { Direction, MatchStatus } from '../types/game';

export interface ClueMeta {
  label: string;
  icon: string;
  color: 'green' | 'yellow' | 'red';
  ariaLabel: string;
}

export function matchStatusMeta(status: MatchStatus): ClueMeta {
  switch (status) {
    case 'MATCH':
      return { label: 'Correct', icon: '✓', color: 'green', ariaLabel: 'Correct match' };
    case 'CLOSE':
      return { label: 'Close', icon: '≈', color: 'yellow', ariaLabel: 'Close match' };
    case 'NO_MATCH':
      return { label: 'Wrong', icon: '✕', color: 'red', ariaLabel: 'No match' };
  }
}

export function directionMeta(dir: Direction): ClueMeta & { arrow: string } {
  switch (dir) {
    case 'MATCH':
      return { label: 'Same', icon: '✓', arrow: '✓', color: 'green', ariaLabel: 'Exact match' };
    case 'UP':
      return { label: 'Higher', icon: '↑', arrow: '↑', color: 'yellow', ariaLabel: 'Target is higher' };
    case 'DOWN':
      return { label: 'Lower', icon: '↓', arrow: '↓', color: 'yellow', ariaLabel: 'Target is lower' };
  }
}

export function evolutionMeta(distance: number | null): ClueMeta {
  if (distance === null) {
    return { label: 'Different family', icon: '✕', color: 'red', ariaLabel: 'Different evolution family' };
  }
  if (distance === 0) {
    return { label: 'Same Pokémon', icon: '✓', color: 'green', ariaLabel: 'Same Pokémon' };
  }
  if (distance <= 2) {
    return {
      label: `${distance} evolution${distance > 1 ? 's' : ''} away`,
      icon: '≈',
      color: 'yellow',
      ariaLabel: `${distance} evolutions away`,
    };
  }
  return { label: 'Distant family', icon: '≈', color: 'yellow', ariaLabel: 'Distant in evolution family' };
}

export function formatHeight(height: number): string {
  return `${height.toFixed(1)} m`;
}

export function formatWeight(weight: number): string {
  return `${weight.toFixed(1)} kg`;
}

export function formatGeneration(gen: string): string {
  const match = gen.match(/generation-([iv]+)/i);
  if (match) {
    return `Gen ${match[1].toUpperCase()}`;
  }
  return gen;
}

export function formatHabitat(habitat: string | null | undefined): string {
  if (!habitat) return 'Unknown';
  return habitat.charAt(0).toUpperCase() + habitat.slice(1);
}

export function formatType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
