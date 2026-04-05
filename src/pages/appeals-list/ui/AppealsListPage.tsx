import type { AppealStatus } from '@/entities/appeal';
import type { AppealsSortField } from '@/entities/appeal/model/appealModel';
import { useAppealsListQuery } from '@/entities/appeal/api/queries';
import { getAppealStatusLabel } from '@/entities/appeal/lib/statusLabels';
import { canDeleteAppeal, useAuth } from '@/entities/user';
import { DeleteAppealModal } from '@/features/appeal-delete';
import { formatDateTime } from '@/shared/lib/formatDate';
import { cn } from '@/shared/lib/cn';
import {
  Button,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listParamsFromSearch } from '../lib/listParamsFromSearch';

const linkAsSecondarySm = cn(
  'inline-flex items-center justify-center rounded-md border border-slate-300',
  'bg-white px-3 py-1.5 text-sm font-medium text-slate-800 transition-colors',
  'hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2',
  'focus-visible:ring-slate-400 focus-visible:ring-offset-2'
);

type DeleteTarget = { id: string; title: string };

export function AppealsListPage() {
  const { role } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(
    () => listParamsFromSearch(searchParams),
    [searchParams]
  );

  const [qInput, setQInput] = useState(() => searchParams.get('q') ?? '');
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  useEffect(() => {
    setQInput(searchParams.get('q') ?? '');
  }, [searchParams]);

  const query = useAppealsListQuery(params);

  const setSort = useCallback(
    (field: AppealsSortField) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        const current = next.get('sortBy');
        const order = next.get('sortOrder');
        if (current === field) {
          next.set('sortOrder', order === 'asc' ? 'desc' : 'asc');
        } else {
          next.set('sortBy', field);
          next.set(
            'sortOrder',
            field === 'createdAt' ? 'desc' : 'asc'
          );
        }
        next.set('page', '1');
        return next;
      });
    },
    [setSearchParams]
  );

  const sortIndicator = (field: AppealsSortField) => {
    if (params.sortBy !== field) return '↕';
    return params.sortOrder === 'asc' ? '↑' : '↓';
  };

  const applySearch = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const trimmed = qInput.trim();
      if (trimmed) next.set('q', trimmed);
      else next.delete('q');
      next.set('page', '1');
      return next;
    });
  };

  const setPage = (p: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(p));
      return next;
    });
  };

  const setPageSize = (size: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('pageSize', String(size));
      next.set('page', '1');
      return next;
    });
  };

  const setStatusFilter = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === '') next.delete('status');
      else next.set('status', value);
      next.set('page', '1');
      return next;
    });
  };

  const totalPages = Math.max(
    1,
    Math.ceil((query.data?.total ?? 0) / params.pageSize)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Обращения</h1>
        <p className="mt-1 text-sm text-slate-600">
          Список с фильтрами, сортировкой и пагинацией (мок API).
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:flex-wrap md:items-end">
        <div className="min-w-[200px] flex-1">
          <Input
            label="Поиск по заголовку и описанию"
            placeholder="Введите текст и нажмите «Найти»"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applySearch();
            }}
          />
        </div>
        <Button type="button" variant="secondary" onClick={applySearch}>
          Найти
        </Button>
        <div className="min-w-[180px]">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Статус
          </label>
          <select
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            value={params.status ?? ''}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Все</option>
            <option value="new">{getAppealStatusLabel('new')}</option>
            <option value="in_progress">
              {getAppealStatusLabel('in_progress')}
            </option>
            <option value="resolved">{getAppealStatusLabel('resolved')}</option>
            <option value="closed">{getAppealStatusLabel('closed')}</option>
          </select>
        </div>
        <div className="min-w-[120px]">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            На странице
          </label>
          <select
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            value={params.pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {query.isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner label="Загрузка списка…" />
        </div>
      ) : null}

      {query.isError ? (
        <div
          className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950"
          role="alert"
        >
          <p className="font-medium">Демо-режим: показываем пример данных</p>
          <p className="mt-1 text-sm text-amber-900/90">
            Бэкенда нет — если что-то пошло не так, ниже деталь. Можно
            повторить запрос.
          </p>
          <p className="mt-2 font-mono text-xs text-amber-800/80">
            {query.error instanceof Error
              ? query.error.message
              : 'Неизвестная ошибка'}
          </p>
          <Button
            type="button"
            className="mt-3"
            variant="secondary"
            onClick={() => void query.refetch()}
          >
            Повторить
          </Button>
        </div>
      ) : null}

      {query.isSuccess && query.data.items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
          <p className="text-lg font-medium text-slate-800">Нет обращений</p>
          <p className="mt-2 text-sm">
            Измените фильтры или поисковый запрос.
          </p>
        </div>
      ) : null}

      {query.isSuccess && query.data.items.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[28%]">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900"
                    onClick={() => setSort('title')}
                  >
                    Заголовок {sortIndicator('title')}
                  </button>
                </TableHead>
                <TableHead className="w-[18%]">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900"
                    onClick={() => setSort('status')}
                  >
                    Статус {sortIndicator('status')}
                  </button>
                </TableHead>
                <TableHead className="w-[22%]">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900"
                    onClick={() => setSort('createdAt')}
                  >
                    Создано {sortIndicator('createdAt')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.data.items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Link
                      to={`/appeals/${row.id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {row.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                      {getAppealStatusLabel(row.status)}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-slate-600">
                    {formatDateTime(row.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/appeals/${row.id}`}
                        className={linkAsSecondarySm}
                      >
                        Открыть
                      </Link>
                      {canDeleteAppeal(role) ? (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            setDeleteTarget({ id: row.id, title: row.title })
                          }
                        >
                          Удалить
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-4 sm:flex-row">
            <p className="text-sm text-slate-600">
              Страница {params.page} из {totalPages} · всего{' '}
              {query.data.total}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={params.page <= 1}
                onClick={() => setPage(params.page - 1)}
              >
                Назад
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={params.page >= totalPages}
                onClick={() => setPage(params.page + 1)}
              >
                Вперёд
              </Button>
            </div>
          </div>
        </>
      ) : null}

      {deleteTarget ? (
        <DeleteAppealModal
          open
          appealId={deleteTarget.id}
          appealTitle={deleteTarget.title}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </div>
  );
}
