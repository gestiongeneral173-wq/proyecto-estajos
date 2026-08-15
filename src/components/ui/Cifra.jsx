import { theme, type } from '../../lib/theme';

/**
 * Cifra — envoltorio tipográfico para cualquier número.
 *
 * Aplica IBM Plex Mono con números tabulares (clase global `cifra`),
 * de modo que las cantidades alinean columna con columna en tablas y
 * listas. Separa visualmente "dato" de "texto".
 *
 * @param {'default'|'muted'|'strong'} [tone='default']
 * @param {'inline'|'figure'} [size='inline']
 *        inline → 13px, dentro de una fila o un párrafo
 *        figure → 22 / 25 / 28 px, para totales y montos destacados
 */
export default function Cifra({
  tone = 'default',
  size = 'inline',
  className = '',
  children,
}) {
  const color =
    tone === 'muted' ? theme.muted : tone === 'strong' ? theme.navyDark : theme.navyMedium;

  const sizeClass = size === 'figure' ? `${type.figure} font-semibold` : 'text-[13px]';

  return (
    <span className={`cifra ${sizeClass} ${className}`} style={{ color }}>
      {children}
    </span>
  );
}
