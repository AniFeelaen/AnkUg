import { Link, Outlet } from 'react-router-dom';
import { RoleSwitcher } from '@/features/role-switcher';

export function MainLayout() {
  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <Link
              to="/"
              className="text-xl font-semibold tracking-tight text-slate-900 hover:text-slate-700"
            >
              АНК-ЮГ OS
            </Link>
            <p className="text-xs text-slate-500">Внутренняя ОС · обращения</p>
          </div>
          <RoleSwitcher />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
