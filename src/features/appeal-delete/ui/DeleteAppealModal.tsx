import { useDeleteAppealMutation } from '@/entities/appeal/api/queries';
import { Button } from '@/shared/ui/button/Button';
import { Modal } from '@/shared/ui/modal/Modal';
import { useToast } from '@/shared/ui';

export interface DeleteAppealModalProps {
  open: boolean;
  onClose: () => void;
  appealId: string;
  appealTitle: string;
  onDeleted?: () => void;
}

export function DeleteAppealModal({
  open,
  onClose,
  appealId,
  appealTitle,
  onDeleted,
}: DeleteAppealModalProps) {
  const { showToast } = useToast();
  const mutation = useDeleteAppealMutation();

  const handleConfirm = () => {
    mutation.mutate(appealId, {
      onSuccess: () => {
        showToast({ variant: 'success', message: 'Обращение удалено' });
        onClose();
        onDeleted?.();
      },
      onError: (err: unknown) => {
        const message =
          err instanceof Error
            ? err.message
            : 'Не удалось удалить обращение';
        showToast({ variant: 'error', message });
      },
    });
  };

  const safeClose = () => {
    if (!mutation.isPending) onClose();
  };

  return (
    <Modal
      open={open}
      title="Удалить обращение?"
      onClose={safeClose}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            disabled={mutation.isPending}
            onClick={safeClose}
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={mutation.isPending}
            onClick={handleConfirm}
          >
            {mutation.isPending ? 'Удаление…' : 'Удалить'}
          </Button>
        </>
      }
    >
      <p className="text-slate-700">
        Будет безвозвратно удалено обращение{' '}
        <span className="font-semibold text-slate-900">«{appealTitle}»</span>.
      </p>
    </Modal>
  );
}
