import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { cn } from '@/shared/lib/cn';

export type ToastVariant = 'success' | 'error';

type ToastItem = {
  id: string;
  variant: ToastVariant;
  message: string;
};

type ToastContextValue = {
  showToast: (payload: { variant: ToastVariant; message: string }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast должен вызываться внутри ToastProvider');
  }
  return ctx;
}

function ToastView({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(() => onDismiss(item.id), 4500);
    return () => window.clearTimeout(t);
  }, [item.id, onDismiss]);

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-lg',
        item.variant === 'success' &&
          'border-emerald-200 bg-emerald-50 text-emerald-900',
        item.variant === 'error' && 'border-rose-200 bg-rose-50 text-rose-900'
      )}
    >
      <span className="text-lg leading-none" aria-hidden>
        {item.variant === 'success' ? '✓' : '✕'}
      </span>
      <p className="flex-1 text-sm font-medium">{item.message}</p>
      <button
        type="button"
        className="rounded p-0.5 text-slate-500 hover:bg-black/5 hover:text-slate-800"
        onClick={() => onDismiss(item.id)}
        aria-label="Закрыть уведомление"
      >
        ×
      </button>
    </div>
  );
}

export function ToastProvider({ children }: PropsWithChildren) {
  const baseId = useId();
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback(
    ({ variant, message }: { variant: ToastVariant; message: string }) => {
      const id = `${baseId}-${crypto.randomUUID()}`;
      setItems((prev) => [...prev, { id, variant, message }]);
    },
    [baseId]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
        aria-live="polite"
      >
        {items.map((item) => (
          <ToastView key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
