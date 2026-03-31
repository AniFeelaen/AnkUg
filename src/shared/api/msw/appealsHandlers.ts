import { http, HttpResponse } from 'msw';
import { appealPatchSchema } from '@/entities/appeal/model/appealSchema';
import type { AppealsListParams, AppealsSortField } from '@/entities/appeal/model/appealModel';
import type { AppealStatus } from '@/entities/appeal';
import {
  deleteAppealById,
  getAppealById,
  listAppeals,
  patchAppealById,
} from './appealsStore';

function pathId(id: string | readonly string[] | undefined): string | undefined {
  if (id === undefined) return undefined;
  return Array.isArray(id) ? id[0] : id;
}

function parseIntParam(v: string | null, fallback: number): number {
  if (v === null || v === '') return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseListParams(url: URL): AppealsListParams {
  const page = Math.max(1, parseIntParam(url.searchParams.get('page'), 1));
  const pageSize = Math.min(
    50,
    Math.max(1, parseIntParam(url.searchParams.get('pageSize'), 10))
  );
  const sortRaw = url.searchParams.get('sortBy');
  const sortBy: AppealsSortField =
    sortRaw === 'title' || sortRaw === 'status' ? sortRaw : 'createdAt';
  const orderRaw = url.searchParams.get('sortOrder');
  const sortOrder = orderRaw === 'asc' ? 'asc' : 'desc';
  const statusRaw = url.searchParams.get('status');
  const status =
    statusRaw === 'new' ||
    statusRaw === 'in_progress' ||
    statusRaw === 'resolved' ||
    statusRaw === 'closed'
      ? (statusRaw as AppealStatus)
      : undefined;
  const q = url.searchParams.get('q') ?? undefined;

  return {
    page,
    pageSize,
    sortBy,
    sortOrder,
    status,
    q,
  };
}

export const appealsHandlers = [
  http.get('/api/appeals', ({ request }) => {
    const url = new URL(request.url);
    const params = parseListParams(url);
    const body = listAppeals(params);
    return HttpResponse.json(body);
  }),

  http.get('/api/appeals/:id', ({ params }) => {
    const id = pathId(params.id);
    if (!id) {
      return HttpResponse.json({ message: 'Не указан id' }, { status: 400 });
    }
    const row = getAppealById(id);
    if (!row) {
      return HttpResponse.json({ message: 'Не найдено' }, { status: 404 });
    }
    return HttpResponse.json(row);
  }),

  http.patch('/api/appeals/:id', async ({ params, request }) => {
    const id = pathId(params.id);
    if (!id) {
      return HttpResponse.json({ message: 'Не указан id' }, { status: 400 });
    }
    const json: unknown = await request.json().catch(() => null);
    const parsed = appealPatchSchema.safeParse(json);
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors;
      return HttpResponse.json(
        { message: 'Ошибка валидации', errors: msg },
        { status: 400 }
      );
    }
    const updated = patchAppealById(id, parsed.data);
    if (!updated) {
      return HttpResponse.json({ message: 'Не найдено' }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),

  http.delete('/api/appeals/:id', ({ params }) => {
    const id = pathId(params.id);
    if (!id) {
      return HttpResponse.json({ message: 'Не указан id' }, { status: 400 });
    }
    const ok = deleteAppealById(id);
    if (!ok) {
      return HttpResponse.json({ message: 'Не найдено' }, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
