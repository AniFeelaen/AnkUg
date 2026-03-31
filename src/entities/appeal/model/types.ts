/** Статусы жизненного цикла обращения в системе. */
export type AppealStatus = 'new' | 'in_progress' | 'resolved' | 'closed';

/** Синоним для ТЗ: доменный статус обращения. */
export type Status = AppealStatus;

export interface Appeal {
  id: string;
  title: string;
  description: string;
  status: AppealStatus;
  /** ISO 8601 */
  createdAt: string;
  /** ISO 8601 */
  updatedAt: string;
  /** Инициатор обращения (опционально для моков). */
  authorId?: string;
}
