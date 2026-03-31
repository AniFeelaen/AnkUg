import type { AppealStatus } from '../model/types';

const MAP: Record<AppealStatus, string> = {
  new: 'Новый',
  in_progress: 'В работе',
  resolved: 'Решено',
  closed: 'Закрыто',
};

export function getAppealStatusLabel(status: AppealStatus): string {
  return MAP[status];
}
