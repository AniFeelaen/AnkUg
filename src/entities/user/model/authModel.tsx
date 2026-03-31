import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { Role, User } from './types';

const MOCK_USER_BASE: Omit<User, 'role'> = {
  id: 'user-1',
  name: 'Демо пользователь',
  email: 'demo@ank-yug.local',
};

export interface AuthContextValue {
  user: User;
  role: Role;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [role, setRoleState] = useState<Role>('manager');

  const setRole = useCallback((next: Role) => {
    setRoleState(next);
  }, []);

  const user = useMemo<User>(
    () => ({ ...MOCK_USER_BASE, role }),
    [role]
  );

  const value = useMemo(
    () => ({ user, role, setRole }),
    [user, role, setRole]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth должен вызываться внутри AuthProvider');
  }
  return ctx;
}

/** Право на удаление обращения — только у администратора. */
export function canDeleteAppeal(role: Role): boolean {
  return role === 'admin';
}

/** Право на редактирование карточки (в ТЗ и менеджер может работать с обращениями). */
export function canEditAppeal(_role: Role): boolean {
  return true;
}
