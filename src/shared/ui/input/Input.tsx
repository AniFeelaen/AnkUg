import type { InputHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';
import { cn } from '@/shared/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id: idProp, className, ...rest },
  ref
) {
  const genId = useId();
  const id = idProp ?? `input-${genId}`;

  return (
    <div className="flex w-full flex-col gap-1">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={id}
        className={cn(
          'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm',
          'placeholder:text-slate-400',
          'focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500',
          error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
          className
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
