import type { Appeal, AppealStatus } from './types';

/** Поля сортировки списка обращений (сервер/мок). */
export type AppealsSortField = 'createdAt' | 'title' | 'status';

export type SortOrder = 'asc' | 'desc';

/** Параметры запроса списка с пагинацией и фильтрами. */
export interface AppealsListParams {
  page: number;
  pageSize: number;
  sortBy: AppealsSortField;
  sortOrder: SortOrder;
  status?: AppealStatus;
  q?: string;
}

/** Ответ API списка обращений. */
export interface AppealsListResponse {
  items: Appeal[];
  total: number;
  page: number;
  pageSize: number;
}

/** Ключи TanStack Query для обращений. */
export const appealQueryKeys = {
  all: ['appeals'] as const,
  lists: () => [...appealQueryKeys.all, 'list'] as const,
  list: (params: AppealsListParams) =>
    [...appealQueryKeys.lists(), params] as const,
  details: () => [...appealQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...appealQueryKeys.details(), id] as const,
};
