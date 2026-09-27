import { Modal } from './Modal';

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="How to Play">
      <div className="flex flex-col gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>
          Guess the Pokémon of the day in 10 tries.
        </p>
        <p>
          After each guess, you'll get clues comparing your Pokémon to the target.
          Use them to narrow it down!
        </p>

        <div className="flex flex-col gap-3">
          <ClueRule
            icon="✓"
            color="green"
            title="Type"
            rules={[
              'Green = exact type match',
              'Yellow = partial type match',
              'Red = no matching type',
            ]}
          />
          <ClueRule
            icon="✓"
            color="green"
            title="Generation"
            rules={[
              'Green = same generation',
              'Red = different generation',
            ]}
          />
          <ClueRule
            icon="✓"
            color="green"
            title="Habitat"
            rules={[
              'Green = same habitat',
              'Red = different habitat',
            ]}
          />
          <DirectionRule title="Height" description="↑ means the target is taller, ↓ means shorter, ✓ means same height" />
          <DirectionRule title="Weight" description="↑ means the target is heavier, ↓ means lighter, ✓ means same weight" />
          <ClueRule
            icon="≈"
            color="yellow"
            title="Evolution"
            rules={[
              'Green = same Pokémon',
              'Yellow = same or nearby evolution family',
              'Red = unrelated evolution family',
            ]}
          />
        </div>

        <div className="rounded-xl p-3" style={{ background: 'var(--bg-secondary)' }}>
          <p className="font-semibold" style={{ color: 'var(--text)' }}>Good to know:</p>
          <ul className="mt-1.5 flex flex-col gap-1 pl-4">
            <li>You have 10 guesses.</li>
            <li>Everyone gets the same Pokémon of the day.</li>
            <li>Come back tomorrow for a new challenge.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}

function ClueRule({ icon, color, title, rules }: { icon: string; color: string; title: string; rules: string[] }) {
  const colorClass = `clue-${color}`;
  return (
    <div className="flex items-start gap-3">
      <div className={`clue-cell ${colorClass} h-9 w-9 shrink-0`}>
        <span className="text-base font-bold">{icon}</span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold" style={{ color: 'var(--text)' }}>{title}</span>
        <ul className="flex flex-col gap-0.5 text-xs">
          {rules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DirectionRule({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="clue-cell clue-yellow h-9 w-9 shrink-0">
        <span className="text-base font-bold">↑↓</span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold" style={{ color: 'var(--text)' }}>{title}</span>
        <span className="text-xs">{description}</span>
      </div>
    </div>
  );
}
