import { useAuth, type Role } from '@/entities/user';
import { cn } from '@/shared/lib/cn';

const ROLES: { value: Role; label: string }[] = [
  { value: 'manager', label: 'Менеджер' },
  { value: 'admin', label: 'Админ' },
];

export function RoleSwitcher() {
  const { role, setRole } = useAuth();

  return (
    <div
      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1"
      role="group"
      aria-label="Роль пользователя (демо RBAC)"
    >
      <span className="hidden text-xs text-slate-500 sm:inline">Роль:</span>
      {ROLES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setRole(value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            role === value
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
