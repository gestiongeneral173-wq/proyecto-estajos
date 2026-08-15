import Modal from './Modal';
import Button from './Button';
import { theme, type } from '../../lib/theme';

/**
 * ConfirmModal — confirmación de una acción irreversible.
 *
 * Solo para acciones que no se pueden deshacer (eliminar jornadas,
 * dar de baja a un trabajador). Para el resto, se ejecuta la acción
 * directamente: pedir confirmación de todo enseña a confirmar sin leer.
 *
 * El botón de confirmar nombra la acción ("Eliminar"), nunca "Aceptar".
 *
 * @param {boolean} open
 * @param {string} title Pregunta o acción. Ej.: "Eliminar 3 jornadas".
 * @param {string} [description] Consecuencia concreta de continuar.
 * @param {string} [confirmLabel='Confirmar']
 * @param {'danger'|'primary'} [tone='danger']
 */
export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'danger',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal open={open} title={title} onClose={onCancel} maxW="max-w-sm">
      {description && (
        <p className={type.body} style={{ color: theme.muted }}>
          {description}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 mt-5">
        <Button variant="outline" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={tone} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
