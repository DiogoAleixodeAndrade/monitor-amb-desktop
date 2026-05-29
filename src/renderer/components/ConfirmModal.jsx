import Button from './Button.jsx';
import Modal from './Modal.jsx';

export default function ConfirmModal({
  open,
  title,
  subtitle,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
  onConfirm,
  onClose
}) {
  return (
    <Modal
      open={open}
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>

          <Button variant={variant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="confirm-modal-content">
        <div className={`confirm-icon confirm-${variant}`}>
          {variant === 'danger' ? '!' : variant === 'eco' ? 'ECO' : '?'}
        </div>

        <p>{message}</p>
      </div>
    </Modal>
  );
}