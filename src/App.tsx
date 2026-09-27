import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { AttemptCounter } from './components/AttemptCounter';
import { PokemonSearch } from './components/PokemonSearch';
import { GuessGrid } from './components/GuessGrid';
import { ClueLegend } from './components/ClueLegend';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { HowToPlayModal } from './components/HowToPlayModal';
import { StatisticsModal } from './components/StatisticsModal';
import { SettingsModal } from './components/SettingsModal';
import { ResultCard } from './components/ResultCard';
import { useGame } from './hooks/useGame';
import { useSettings } from './hooks/useSettings';
import { loadStats, recordGameResult } from './services/statisticsApi';
import type { GameStats } from './types/game';

export default function App() {
  const { gameState, status, error, guess, start } = useGame();
  const { settings, updateTheme, toggleColorblind, toggleReducedMotion, toggleSound } = useSettings();

  const [showHowTo, setShowHowTo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState<GameStats>(() => loadStats());

  // Record result when game ends
  useEffect(() => {
    if (!gameState || !gameState.gameOver) return;
    const updated = recordGameResult(gameState.won, gameState.attempts);
    setStats(updated);
  }, [gameState?.gameOver, gameState?.won, gameState?.attempts]);

  const guessedNames = useMemo(() => {
    const set = new Set<string>();
    gameState?.guesses.forEach((g) => set.add(g.pokemon.name.toLowerCase()));
    return set;
  }, [gameState?.guesses]);

  const isLoading = status === 'idle' || status === 'loading';
  const gameOver = gameState?.gameOver ?? false;

  // Show how-to-play on first visit
  useEffect(() => {
    const seen = localStorage.getItem('pokeguess:seen-howto');
    if (!seen) {
      setShowHowTo(true);
      localStorage.setItem('pokeguess:seen-howto', '1');
    }
  }, []);

  return (
    <div className="min-h-screen">
      <div className="pokeball-bg" aria-hidden="true" />

      <Header
        onHowToPlay={() => setShowHowTo(true)}
        onStatistics={() => setShowStats(true)}
        onSettings={() => setShowSettings(true)}
      />

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {isLoading && !gameState ? (
          <LoadingState message="Loading today's challenge" />
        ) : error && !gameState ? (
          <ErrorState message={error} onRetry={start} />
        ) : gameState ? (
          <div className="flex flex-col gap-6">
            {/* Game heading */}
            {!gameOver && (
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="font-display text-2xl font-extrabold sm:text-3xl" style={{ color: 'var(--text)' }}>
                  Guess Today's Pokémon
                </h1>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Can you figure it out in 10 tries?
                </p>
              </div>
            )}

            {/* Progress */}
            {!gameOver && (
              <AttemptCounter
                attempts={gameState.attempts}
                maxAttempts={gameState.maxAttempts}
                remaining={gameState.remainingAttempts}
              />
            )}

            {/* Search */}
            {!gameOver && (
              <PokemonSearch
                onGuess={guess}
                disabled={gameOver}
                submitting={status === 'guessing'}
                guessedNames={guessedNames}
              />
            )}

            {/* Error on guess */}
            {error && gameState && !gameOver && (
              <ErrorState message={error} onRetry={() => {}} />
            )}

            {/* Legend */}
            {!gameOver && gameState.guesses.length > 0 && <ClueLegend />}

            {/* Guess grid */}
            {!gameOver && (
              <GuessGrid guesses={gameState.guesses} />
            )}

            {/* Result card */}
            {gameOver && (
              <div className="card p-5 sm:p-6 animate-slide-up">
                <ResultCard gameState={gameState} stats={stats} />
              </div>
            )}
          </div>
        ) : (
          <ErrorState message="Something went wrong. Please try again." onRetry={start} />
        )}
      </main>

      {/* Modals */}
      <HowToPlayModal open={showHowTo} onClose={() => setShowHowTo(false)} />
      <StatisticsModal open={showStats} onClose={() => setShowStats(false)} stats={stats} />
      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateTheme={updateTheme}
        onToggleColorblind={toggleColorblind}
        onToggleReducedMotion={toggleReducedMotion}
        onToggleSound={toggleSound}
      />
    </div>
  );
}
