interface HeaderProps {
  onHowToPlay: () => void;
  onStatistics: () => void;
  onSettings: () => void;
}

export function Header({ onHowToPlay, onStatistics, onSettings }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b backdrop-blur-lg" style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--card) 85%, transparent)' }}>
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <PokeballIcon className="h-8 w-8 shrink-0" />
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
              Poké<span className="text-poke-yellow">Guess</span>
            </span>
            <span className="hidden text-[10px] font-medium sm:block" style={{ color: 'var(--text-secondary)' }}>
              Guess Today's Pokémon
            </span>
          </div>
        </div>

        {/* Actions */}
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Game options">
          <button
            onClick={onStatistics}
            className="btn-ghost flex h-10 w-10 items-center justify-center rounded-xl"
            aria-label="View statistics"
            title="Statistics"
          >
            <ChartIcon />
          </button>
          <button
            onClick={onHowToPlay}
            className="btn-ghost flex h-10 w-10 items-center justify-center rounded-xl"
            aria-label="How to play"
            title="How to Play"
          >
            <HelpIcon />
          </button>
          <button
            onClick={onSettings}
            className="btn-ghost flex h-10 w-10 items-center justify-center rounded-xl"
            aria-label="Settings"
            title="Settings"
          >
            <GearIcon />
          </button>
        </nav>
      </div>
    </header>
  );
}

function PokeballIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="5" style={{ color: 'var(--text)' }} />
      <path d="M8 50a42 42 0 0 1 84 0Z" fill="#ee1515" stroke="currentColor" strokeWidth="5" style={{ color: 'var(--text)' }} />
      <line x1="8" y1="50" x2="34" y2="50" stroke="currentColor" strokeWidth="5" style={{ color: 'var(--text)' }} />
      <line x1="66" y1="50" x2="92" y2="50" stroke="currentColor" strokeWidth="5" style={{ color: 'var(--text)' }} />
      <circle cx="50" cy="50" r="14" fill="var(--card)" stroke="currentColor" strokeWidth="5" style={{ color: 'var(--text)' }} />
      <circle cx="50" cy="50" r="5" fill="var(--card)" stroke="currentColor" strokeWidth="3" style={{ color: 'var(--text)' }} />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h2v8H3zM9 8h2v13H9zM15 11h2v10h-2zM21 4h2v17h-2z" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
