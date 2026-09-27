import { Modal } from './Modal';
import type { GameStats } from '../types/game';

interface StatisticsModalProps {
  open: boolean;
  onClose: () => void;
  stats: GameStats;
}

export function StatisticsModal({ open, onClose, stats }: StatisticsModalProps) {
  const winPct = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
  const maxDist = Math.max(...stats.distribution, 1);

  return (
    <Modal open={open} onClose={onClose} title="Statistics">
      <div className="flex flex-col gap-5">
        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-2">
          <StatBox label="Played" value={stats.played} />
          <StatBox label="Win %" value={`${winPct}`} />
          <StatBox label="Streak" value={stats.currentStreak} />
          <StatBox label="Max Streak" value={stats.maxStreak} />
        </div>

        {/* Distribution chart */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
            Guess Distribution
          </h3>
          <div className="flex flex-col gap-1.5">
            {stats.distribution.map((count, i) => {
              const width = count > 0 ? Math.max((count / maxDist) * 100, 8) : 2;
              const hasCount = count > 0;
              return (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-6 text-right font-bold tabular-nums" style={{ color: 'var(--text)' }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 overflow-hidden">
                    <div
                      className="flex items-center justify-end rounded-md px-2 py-1 text-xs font-bold tabular-nums transition-all duration-500"
                      style={{
                        width: `${width}%`,
                        minWidth: hasCount ? '2rem' : '0.5rem',
                        background: hasCount
                          ? 'linear-gradient(90deg, #ffcb05, #e0ac00)'
                          : 'var(--bg-secondary)',
                        color: hasCount ? '#0f1838' : 'var(--text-secondary)',
                      }}
                    >
                      {hasCount ? count : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {stats.played === 0 && (
          <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Play your first game to start building stats!
          </p>
        )}
      </div>
    </Modal>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text)' }}>
        {value}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
    </div>
  );
}
