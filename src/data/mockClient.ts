import type { Appeal } from '@/entities/appeal';
import { demoDelay } from './demoDelay';
import { listAppeals } from './demoAppealsStore';

/**
 * Упрощённый доступ к списку для демо (имитация сети).
 * Основной поток приложения идёт через `entities/appeal/api/appealApi`.
 */
export async function getAppeals(): Promise<Appeal[]> {
  await demoDelay();
  return listAppeals({
    page: 1,
    pageSize: 500,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  }).items;
}
