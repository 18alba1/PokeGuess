interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong. Please try again.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-poke-red/30 bg-poke-red/5 px-6 py-8 text-center" role="alert">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-poke-red/15">
        <svg className="h-6 w-6 text-poke-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-poke-red">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary text-sm">
          Try Again
        </button>
      )}
    </div>
  );
}
