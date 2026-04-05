import type { Appeal } from '../model/types';
import type { AppealPatchInput } from '../model/appealSchema';
import type { AppealsListParams, AppealsListResponse } from '../model/appealModel';
import { demoDelay } from '@/data/demoDelay';
import {
  deleteAppealById,
  getAppealById,
  listAppeals,
  patchAppealById,
} from '@/data/demoAppealsStore';

/** Демо без бэкенда: данные в памяти, имитация задержки сети. */
export async function fetchAppealsList(
  params: AppealsListParams
): Promise<AppealsListResponse> {
  await demoDelay();
  return listAppeals(params);
}

export async function fetchAppealById(id: string): Promise<Appeal> {
  await demoDelay();
  const row = getAppealById(id);
  if (!row) {
    throw new Error('Обращение не найдено');
  }
  return row;
}

export async function patchAppeal(
  id: string,
  body: AppealPatchInput
): Promise<Appeal> {
  await demoDelay();
  const updated = patchAppealById(id, body);
  if (!updated) {
    throw new Error('Обращение не найдено');
  }
  return updated;
}

export async function deleteAppeal(id: string): Promise<void> {
  await demoDelay();
  const ok = deleteAppealById(id);
  if (!ok) {
    throw new Error('Обращение не найдено');
  }
}
