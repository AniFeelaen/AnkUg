import type { Appeal, AppealStatus } from '@/entities/appeal';
import type {
  AppealsListParams,
  AppealsListResponse,
  AppealsSortField,
  SortOrder,
} from '@/entities/appeal/model/appealModel';
import { appealsSeed } from './data/appealsSeed';

let rows: Appeal[] = appealsSeed.map((a) => ({ ...a }));

const statusRank: Record<AppealStatus, number> = {
  new: 0,
  in_progress: 1,
  resolved: 2,
  closed: 3,
};

function compare(
  a: Appeal,
  b: Appeal,
  sortBy: AppealsSortField,
  sortOrder: SortOrder
): number {
  const dir = sortOrder === 'asc' ? 1 : -1;
  if (sortBy === 'title') {
    return a.title.localeCompare(b.title, 'ru') * dir;
  }
  if (sortBy === 'status') {
    return (statusRank[a.status] - statusRank[b.status]) * dir;
  }
  const ta = new Date(a.createdAt).getTime();
  const tb = new Date(b.createdAt).getTime();
  return (ta - tb) * dir;
}

export function resetAppealsStore(): void {
  rows = appealsSeed.map((x) => ({ ...x }));
}

export function listAppeals(params: AppealsListParams): AppealsListResponse {
  let list = [...rows];

  const q = params.q?.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }

  if (params.status) {
    list = list.filter((item) => item.status === params.status);
  }

  list.sort((a, b) => compare(a, b, params.sortBy, params.sortOrder));

  const total = list.length;
  const start = (params.page - 1) * params.pageSize;
  const items = list.slice(start, start + params.pageSize);

  return {
    items,
    total,
    page: params.page,
    pageSize: params.pageSize,
  };
}

export function getAppealById(id: string): Appeal | undefined {
  return rows.find((r) => r.id === id);
}

export function patchAppealById(
  id: string,
  patch: Pick<Appeal, 'title' | 'description' | 'status'>
): Appeal | undefined {
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  const next: Appeal = {
    ...rows[idx],
    ...patch,
    updatedAt: now,
  };
  rows[idx] = next;
  return next;
}

export function deleteAppealById(id: string): boolean {
  const before = rows.length;
  rows = rows.filter((r) => r.id !== id);
  return rows.length < before;
}
