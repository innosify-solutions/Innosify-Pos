import { Modal, ModalFooter } from './Modal';

export function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  loading,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <ModalFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          confirmVariant={variant}
          loading={loading}
        />
      }
    >
      <p className="text-sm text-content-muted">{message}</p>
    </Modal>
  );
}
