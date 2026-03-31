/** Роли для RBAC: менеджер — операции по обращениям; админ — расширенные действия (напр. удаление). */
export type Role = 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
