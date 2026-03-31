import type { TextareaHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';
import { cn } from '@/shared/lib/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, id: idProp, className, rows = 5, ...rest }, ref) {
    const genId = useId();
    const id = idProp ?? `textarea-${genId}`;

    return (
      <div className="flex w-full flex-col gap-1">
        {label ? (
          <label htmlFor={id} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={id}
          rows={rows}
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
  }
);
