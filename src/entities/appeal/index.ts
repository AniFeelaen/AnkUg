export type { Appeal, AppealStatus, Status } from './model/types';
export type { AppealPatchInput } from './model/appealSchema';
export { appealPatchSchema, appealStatusSchema } from './model/appealSchema';
export type {
  AppealsListParams,
  AppealsListResponse,
  AppealsSortField,
  SortOrder,
} from './model/appealModel';
export { appealQueryKeys } from './model/appealModel';
export {
  deleteAppeal,
  fetchAppealById,
  fetchAppealsList,
  patchAppeal,
} from './api/appealApi';
export {
  useAppealDetailQuery,
  useAppealsListQuery,
  useDeleteAppealMutation,
  usePatchAppealMutation,
} from './api/queries';
