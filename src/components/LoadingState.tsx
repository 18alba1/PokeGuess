import { useEffect, useState } from 'react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  const dots = useAnimatedDots();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12" role="status" aria-live="polite">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-navy-700/20" />
        <div className="absolute inset-0 animate-spin-slow rounded-full border-4 border-transparent border-t-poke-yellow" />
        <div className="absolute inset-3 rounded-full bg-poke-red/20 animate-pulse" />
      </div>
      <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        {message}
        {dots}
      </p>
    </div>
  );
}

function useAnimatedDots(): string {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => (c + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return '.'.repeat(count);
}
