import type { Appeal } from '../model/types';
import type {
  AppealPatchInput,
} from '../model/appealSchema';
import type { AppealsListParams, AppealsListResponse } from '../model/appealModel';

const BASE = '/api/appeals';

function toSearchParams(params: AppealsListParams): string {
  const sp = new URLSearchParams();
  sp.set('page', String(params.page));
  sp.set('pageSize', String(params.pageSize));
  sp.set('sortBy', params.sortBy);
  sp.set('sortOrder', params.sortOrder);
  if (params.status) sp.set('status', params.status);
  if (params.q?.trim()) sp.set('q', params.q.trim());
  return sp.toString();
}

export async function fetchAppealsList(
  params: AppealsListParams
): Promise<AppealsListResponse> {
  const res = await fetch(`${BASE}?${toSearchParams(params)}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Ошибка ${res.status}`);
  }
  return res.json() as Promise<AppealsListResponse>;
}

export async function fetchAppealById(id: string): Promise<Appeal> {
  const res = await fetch(`${BASE}/${encodeURIComponent(id)}`);
  if (res.status === 404) {
    throw new Error('Обращение не найдено');
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Ошибка ${res.status}`);
  }
  return res.json() as Promise<Appeal>;
}

export async function patchAppeal(
  id: string,
  body: AppealPatchInput
): Promise<Appeal> {
  const res = await fetch(`${BASE}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.status === 404) {
    throw new Error('Обращение не найдено');
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Ошибка ${res.status}`);
  }
  return res.json() as Promise<Appeal>;
}

export async function deleteAppeal(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (res.status === 404) {
    throw new Error('Обращение не найдено');
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Ошибка ${res.status}`);
  }
}
