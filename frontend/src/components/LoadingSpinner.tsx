import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

/**
 * Dual black/white “snake” loader for route/page refresh states.
 */
export default function LoadingSpinner({ fullScreen = true }: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-5" role="status" aria-live="polite">
      <div className="snake-loader" aria-hidden="true">
        <svg className="snake-loader__svg" viewBox="0 0 64 64">
          <circle className="snake-loader__track" cx="32" cy="32" r="26" />
          <circle className="snake-loader__snake snake-loader__snake--black" cx="32" cy="32" r="26" />
          <circle className="snake-loader__snake snake-loader__snake--white" cx="32" cy="32" r="26" />
        </svg>
      </div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-accent/50 dark:text-white/50">
        Loading
      </p>
      <span className="sr-only">Loading</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={cn(
          'fixed inset-0 z-[9999] flex items-center justify-center',
          'bg-white dark:bg-dark-surface',
        )}
      >
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-16 sm:py-20">{spinner}</div>;
}
