import { useEffect } from 'react';
import { X } from 'lucide-react';
import { theme, motion, type } from '../../lib/theme';

/**
 * Modal — hoja inferior en teléfono, diálogo centrado en tablet y computadora.
 *
 * Este cambio de posición ya es el comportamiento correcto del sistema
 * (Doc2 §7) y no debe alterarse: en teléfono la hoja queda al alcance
 * del pulgar; en pantallas grandes, un diálogo centrado.
 *
 * El indicador de arrastre solo se muestra en teléfono.
 *
 * @param {boolean} open
 * @param {string} title Título visible; también da nombre accesible al diálogo.
 * @param {string} [eyebrow] Etiqueta pequeña sobre el título.
 * @param {() => void} onClose Cierre por botón, clic en el fondo o tecla Escape.
 * @param {string} [maxW='max-w-md'] Ancho máximo desde tablet.
 * @param {React.ReactNode} [footer] Zona de acciones fija al pie del contenido.
 */
export default function Modal({
  open,
  title,
  eyebrow,
  onClose,
  maxW = 'max-w-md',
  footer,
  children,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: 'rgba(16,24,32,0.35)' }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-t-2xl sm:rounded-xl px-5 pb-6 pt-3 sm:pt-5 shadow-sheet
          w-full ${maxW} max-h-[88vh] overflow-y-auto`}
        style={{ animation: motion.sheetIn }}
      >
        <div
          aria-hidden="true"
          className="w-8 h-1 rounded-full mx-auto mb-4 sm:hidden"
          style={{ background: theme.line }}
        />

        <div className="flex items-start justify-between mb-5 gap-3">
          <div className="min-w-0">
            {eyebrow && (
              <p className={type.eyebrow} style={{ color: theme.muted }}>
                {eyebrow}
              </p>
            )}
            <h2
              className={`${type.subtitle} font-semibold truncate`}
              style={{ color: theme.navyDark }}
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="w-9 h-9 -mr-2 flex-shrink-0 flex items-center justify-center rounded-lg
              hover:bg-gray-50 active:scale-90 transition-all"
            style={{ color: theme.muted }}
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        {children}

        {footer && <div className="mt-5">{footer}</div>}
      </div>
    </div>
  );
}
