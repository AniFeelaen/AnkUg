import { zodResolver } from '@hookform/resolvers/zod';
import { appealPatchSchema } from '@/entities/appeal/model/appealSchema';
import type { AppealPatchInput } from '@/entities/appeal/model/appealSchema';
import {
  useAppealDetailQuery,
  usePatchAppealMutation,
} from '@/entities/appeal/api/queries';
import { getAppealStatusLabel } from '@/entities/appeal/lib/statusLabels';
import { canDeleteAppeal, useAuth } from '@/entities/user';
import { DeleteAppealModal } from '@/features/appeal-delete';
import { formatDateTime } from '@/shared/lib/formatDate';
import { Button, Input, Spinner, Textarea, useToast } from '@/shared/ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

export function AppealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { showToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const query = useAppealDetailQuery(id);
  const patchMutation = usePatchAppealMutation();

  const form = useForm<AppealPatchInput>({
    resolver: zodResolver(appealPatchSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'new',
    },
  });

  const { register, handleSubmit, reset, formState } = form;

  useEffect(() => {
    if (query.data) {
      reset({
        title: query.data.title,
        description: query.data.description,
        status: query.data.status,
      });
    }
  }, [query.data, reset]);

  if (!id) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (values: AppealPatchInput) => {
    patchMutation.mutate(
      { id, body: values },
      {
        onSuccess: () => {
          showToast({ variant: 'success', message: 'Изменения сохранены' });
        },
        onError: (err: unknown) => {
          showToast({
            variant: 'error',
            message:
              err instanceof Error ? err.message : 'Не удалось сохранить',
          });
        },
      }
    );
  };

  if (query.isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner label="Загрузка карточки…" />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div
        className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-950"
        role="alert"
      >
        <p className="font-semibold">Демо-режим: показываем пример данных</p>
        <p className="mt-2 text-sm text-amber-900/90">
          Карточка не загрузилась. Деталь ниже — можно вернуться к списку или
          повторить.
        </p>
        <p className="mt-2 font-mono text-xs text-amber-800/80">
          {query.error instanceof Error
            ? query.error.message
            : 'Ошибка загрузки'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Назад
          </Button>
          <Button type="button" onClick={() => navigate('/')}>
            К списку
          </Button>
          <Button type="button" variant="secondary" onClick={() => void query.refetch()}>
            Повторить
          </Button>
        </div>
      </div>
    );
  }

  if (!query.data) {
    return null;
  }

  const appeal = query.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← К списку
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Карточка обращения
          </h1>
          <p className="mt-1 font-mono text-xs text-slate-500">{appeal.id}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canDeleteAppeal(role) ? (
            <Button
              type="button"
              variant="danger"
              onClick={() => setDeleteOpen(true)}
            >
              Удалить
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-3">
        <div className="space-y-2 text-sm lg:col-span-1">
          <p className="text-slate-500">Создано</p>
          <p className="font-medium text-slate-900">
            {formatDateTime(appeal.createdAt)}
          </p>
          <p className="pt-2 text-slate-500">Обновлено</p>
          <p className="font-medium text-slate-900">
            {formatDateTime(appeal.updatedAt)}
          </p>
        </div>

        <form
          className="space-y-4 lg:col-span-2"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Input
            label="Заголовок"
            {...register('title')}
            error={formState.errors.title?.message}
          />
          <Textarea
            label="Описание"
            {...register('description')}
            error={formState.errors.description?.message}
            rows={6}
          />
          <div>
            <label
              htmlFor="appeal-status"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Статус
            </label>
            <select
              id="appeal-status"
              className="w-full max-w-md rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              {...register('status')}
            >
              <option value="new">{getAppealStatusLabel('new')}</option>
              <option value="in_progress">
                {getAppealStatusLabel('in_progress')}
              </option>
              <option value="resolved">
                {getAppealStatusLabel('resolved')}
              </option>
              <option value="closed">{getAppealStatusLabel('closed')}</option>
            </select>
            {formState.errors.status?.message ? (
              <p className="mt-1 text-sm text-rose-600" role="alert">
                {formState.errors.status.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              type="submit"
              disabled={patchMutation.isPending || !formState.isDirty}
            >
              {patchMutation.isPending ? 'Сохранение…' : 'Сохранить'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={patchMutation.isPending}
              onClick={() =>
                reset({
                  title: appeal.title,
                  description: appeal.description,
                  status: appeal.status,
                })
              }
            >
              Сбросить
            </Button>
          </div>
        </form>
      </div>

      {deleteOpen ? (
        <DeleteAppealModal
          open
          appealId={appeal.id}
          appealTitle={appeal.title}
          onClose={() => setDeleteOpen(false)}
          onDeleted={() => navigate('/')}
        />
      ) : null}
    </div>
  );
}
