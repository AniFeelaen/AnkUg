import { cn } from '@/shared/lib/cn';

export interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className, label = 'Загрузка…' }: SpinnerProps) {
  return (
    <div
      className={cn('flex items-center gap-2 text-slate-600', className)}
      role="status"
      aria-live="polite"
    >
      <span
        className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"
        aria-hidden
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}
