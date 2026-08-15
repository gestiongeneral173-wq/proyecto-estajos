import { theme, neutral } from '../../lib/theme';

/**
 * StatusDot — punto de color que precede a una etiqueta de estado.
 *
 * Nunca va solo: siempre acompaña al texto del estado ("● Cerrada"),
 * porque el color por sí mismo no es accesible.
 *
 * @param {'ok'|'pendiente'|'error'} [tone='ok']
 */
export default function StatusDot({ tone = 'ok', className = '' }) {
  const color = tone === 'ok' ? theme.primary : tone === 'pendiente' ? neutral : theme.danger;

  return (
    <span
      aria-hidden="true"
      className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${className}`}
      style={{ background: color }}
    />
  );
}
