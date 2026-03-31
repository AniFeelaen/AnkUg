import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AppealPatchInput } from '../model/appealSchema';
import type { AppealsListParams } from '../model/appealModel';
import { appealQueryKeys } from '../model/appealModel';
import {
  deleteAppeal,
  fetchAppealById,
  fetchAppealsList,
  patchAppeal,
} from './appealApi';

export function useAppealsListQuery(params: AppealsListParams) {
  return useQuery({
    queryKey: appealQueryKeys.list(params),
    queryFn: () => fetchAppealsList(params),
  });
}

export function useAppealDetailQuery(id: string | undefined) {
  return useQuery({
    queryKey: appealQueryKeys.detail(id ?? ''),
    queryFn: () => fetchAppealById(id!),
    enabled: Boolean(id),
  });
}

export function usePatchAppealMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AppealPatchInput }) =>
      patchAppeal(id, body),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: appealQueryKeys.lists() });
      void queryClient.invalidateQueries({
        queryKey: appealQueryKeys.detail(id),
      });
    },
  });
}

export function useDeleteAppealMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAppeal(id),
    onSuccess: (_void, id) => {
      void queryClient.invalidateQueries({ queryKey: appealQueryKeys.lists() });
      void queryClient.removeQueries({
        queryKey: appealQueryKeys.detail(id),
      });
    },
  });
}
