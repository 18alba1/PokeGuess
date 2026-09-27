import type { ClueMeta } from '../utils/clueHelpers';

interface ClueCellProps {
  meta: ClueMeta;
  value?: string;
  delay?: number;
}

export function ClueCell({ meta, value, delay = 0 }: ClueCellProps) {
  const colorClass = `clue-${meta.color}`;

  return (
    <div
      className={`clue-cell ${colorClass} animate-reveal-pop`}
      style={{ animationDelay: `${delay}ms` }}
      role="img"
      aria-label={`${meta.label}${value ? ': ' + value : ''}`}
      title={meta.ariaLabel}
    >
      <span className="text-lg font-bold leading-none" aria-hidden="true">
        {meta.icon}
      </span>
      {value && (
        <span className="text-xs font-semibold leading-tight">
          {value}
        </span>
      )}
    </div>
  );
}

interface DirectionCellProps {
  meta: ClueMeta & { arrow: string };
  value: string;
  delay?: number;
}

export function DirectionCell({ meta, value, delay = 0 }: DirectionCellProps) {
  const colorClass = `clue-${meta.color}`;

  return (
    <div
      className={`clue-cell ${colorClass} animate-reveal-pop`}
      style={{ animationDelay: `${delay}ms` }}
      role="img"
      aria-label={`${meta.label}: ${value}`}
      title={meta.ariaLabel}
    >
      <span className="text-xl font-bold leading-none" aria-hidden="true">
        {meta.arrow}
      </span>
      <span className="text-xs font-semibold leading-tight">{value}</span>
    </div>
  );
}
