interface AttemptCounterProps {
  attempts: number;
  maxAttempts: number;
  remaining: number;
}

export function AttemptCounter({ attempts, maxAttempts, remaining }: AttemptCounterProps) {
  const dots = Array.from({ length: maxAttempts }, (_, i) => i < attempts);

  return (
    <div className="flex flex-col items-center gap-2" aria-label={`Attempt ${attempts} of ${maxAttempts}, ${remaining} guesses remaining`}>
      <div className="flex items-center gap-3 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
        <span>
          Attempt <span style={{ color: 'var(--text)' }}>{attempts}</span> / {maxAttempts}
        </span>
        <span className="h-4 w-px" style={{ background: 'var(--border)' }} />
        <span className={remaining <= 3 ? 'text-poke-red font-bold' : ''}>
          {remaining} {remaining === 1 ? 'guess' : 'guesses'} left
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5" role="img" aria-label={`${attempts} of ${maxAttempts} attempts used`}>
        {dots.map((filled, i) => (
          <span
            key={i}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              filled ? 'bg-poke-red scale-110' : 'border-2'
            }`}
            style={!filled ? { borderColor: 'var(--border)' } : undefined}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
