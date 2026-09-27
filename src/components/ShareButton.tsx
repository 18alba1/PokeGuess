import { useState } from 'react';
import type { GameState } from '../types/game';
import { getShareIndex } from '../services/statisticsApi';
import { matchStatusMeta } from '../utils/clueHelpers';

interface ShareButtonProps {
  gameState: GameState;
  won: boolean;
}

export function ShareButton({ gameState, won }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const buildShareText = (): string => {
    const index = getShareIndex();
    const score = won ? `${gameState.attempts}/${gameState.maxAttempts}` : `X/${gameState.maxAttempts}`;

    const emojis = gameState.guesses.map((g) => {
      const parts = [g.type, g.generation, g.habitat];
      const heightEmoji = g.height === 'MATCH' ? '🟩' : '🟨';
      const weightEmoji = g.weight === 'MATCH' ? '🟩' : '🟨';
      const evoEmoji = g.evolutionDistance === null ? '🟥' : g.evolutionDistance === 0 ? '🟩' : '🟨';

      return parts.map((s) => statusToEmoji(s)).join('') + heightEmoji + weightEmoji + evoEmoji;
    });

    const typeIcons = won ? emojis.join('\n') : emojis.join('\n');

    return `PokéGuess #${index}\n${typeIcons}\n${won ? 'Solved in' : 'Failed in'} ${score}`;
  };

  const handleShare = async () => {
    const text = buildShareText();
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
    } catch {
      // user cancelled or share failed, fall through to clipboard
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Final fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button onClick={handleShare} className="btn btn-primary w-full">
      {copied ? (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Result copied!
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 1 1 0-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 1 0 .684-2.18m-.684 2.18a3 3 0 1 1 .684-2.18" />
          </svg>
          Share Result
        </>
      )}
    </button>
  );
}

function statusToEmoji(status: 'MATCH' | 'CLOSE' | 'NO_MATCH'): string {
  const meta = matchStatusMeta(status);
  if (meta.color === 'green') return '🟩';
  if (meta.color === 'yellow') return '🟨';
  return '🟥';
}
