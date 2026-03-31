import type { AppealStatus } from '@/entities/appeal';
import type {
  AppealsListParams,
  AppealsSortField,
} from '@/entities/appeal/model/appealModel';

function parsePositiveInt(raw: string | null, fallback: number): number {
  if (raw === null || raw === '') return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function listParamsFromSearch(
  searchParams: URLSearchParams
): AppealsListParams {
  const page = Math.max(1, parsePositiveInt(searchParams.get('page'), 1));
  const pageSize = Math.min(
    50,
    Math.max(1, parsePositiveInt(searchParams.get('pageSize'), 10))
  );
  const sortRaw = searchParams.get('sortBy');
  const sortBy: AppealsSortField =
    sortRaw === 'title' || sortRaw === 'status' || sortRaw === 'createdAt'
      ? sortRaw
      : 'createdAt';
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
  const st = searchParams.get('status');
  const status: AppealStatus | undefined =
    st === 'new' ||
    st === 'in_progress' ||
    st === 'resolved' ||
    st === 'closed'
      ? st
      : undefined;
  const qRaw = searchParams.get('q');
  const q = qRaw && qRaw.trim() !== '' ? qRaw.trim() : undefined;

  return { page, pageSize, sortBy, sortOrder, status, q };
}
