export function ClueLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
      <div className="flex items-center gap-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded clue-green text-xs font-bold">✓</span>
        <span>Correct</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded clue-yellow text-xs font-bold">≈</span>
        <span>Close</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded clue-red text-xs font-bold">✕</span>
        <span>Wrong</span>
      </div>
    </div>
  );
}
