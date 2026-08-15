import { theme } from '../../lib/theme';

/**
 * InlineField — campo de edición rápida dentro de una fila de tabla.
 *
 * Deliberadamente más pequeño y denso que `Input` (Doc3 §9): radio de
 * 4px, relleno mínimo y ancho fijo. No lleva etiqueta propia — la
 * cabecera de la columna hace ese trabajo, así que `aria-label` es
 * obligatorio para que siga siendo accesible.
 *
 * NO usar en formularios: para eso está `Input`.
 *
 * @param {string} ariaLabel Nombre accesible del dato que se edita.
 * @param {number} [widthPx=44]
 */
export default function InlineField({
  ariaLabel,
  widthPx = 44,
  className = '',
  style = {},
  ...rest
}) {
  return (
    <input
      aria-label={ariaLabel}
      className={`cifra text-[13px] text-right px-1 py-1 rounded border bg-white
        outline-none transition-colors ${className}`}
      style={{ width: widthPx, borderColor: theme.line, color: theme.navyDark, ...style }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = theme.primary;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = theme.line;
      }}
      {...rest}
    />
  );
}
