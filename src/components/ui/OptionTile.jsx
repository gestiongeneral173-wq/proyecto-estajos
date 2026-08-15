import { theme, type } from '../../lib/theme';
import { Check } from 'lucide-react';

/**
 * OptionTile — mosaico seleccionable dentro de una cuadrícula de opciones.
 *
 * Es el patrón de elección del sistema: elegir furgoneta, marcar los
 * roles de una persona. Sustituye al radio y al checkbox nativos, que
 * son demasiado pequeños para usarse con guantes o a pleno sol.
 *
 * El estado seleccionado se marca con borde de color Y con una palomita
 * (o con la insignia que se pase en `leading`), nunca solo con color.
 *
 * @param {boolean} selected
 * @param {boolean} [disabled] Opción no disponible (ej. furgoneta ya registrada).
 * @param {React.ReactNode} [leading] Insignia o icono a la izquierda del título.
 * @param {string} title
 * @param {React.ReactNode} [meta] Línea secundaria (ej. "8 plazas").
 * @param {string} [note] Línea de estado en color primario o apagado.
 * @param {'row'|'block'} [layout='block']
 */
export default function OptionTile({
  selected = false,
  disabled = false,
  leading,
  title,
  meta,
  note,
  layout = 'block',
  onClick,
  className = '',
}) {
  const borderColor = selected ? theme.primary : theme.line;

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={`relative rounded-xl text-left transition-all active:scale-[0.98]
        hover:border-current disabled:cursor-not-allowed disabled:opacity-60
        ${layout === 'row' ? 'p-2.5 flex items-center gap-2' : 'p-3 min-h-[76px]'}
        ${className}`}
      style={{
        border: `1px solid ${borderColor}`,
        background: disabled ? theme.appBg : '#fff',
      }}
    >
      {selected && layout === 'block' && (
        <span
          aria-hidden="true"
          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: theme.primary }}
        >
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
      )}

      {leading}

      <span className={layout === 'row' ? '' : 'block'}>
        <span
          className={`block ${type.subtitle} font-semibold`}
          style={{ color: disabled ? theme.muted : theme.navyDark }}
        >
          {title}
        </span>

        {meta && (
          <span className="block text-[11px] mt-0.5" style={{ color: theme.muted }}>
            {meta}
          </span>
        )}

        {note && (
          <span
            className="block text-[11px] font-medium mt-1.5"
            style={{ color: disabled ? theme.muted : theme.primary }}
          >
            {note}
          </span>
        )}
      </span>
    </button>
  );
}
