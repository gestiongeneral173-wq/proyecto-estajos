import Badge from './Badge';

/**
 * BadgeGroup — fila de insignias de una misma persona.
 *
 * Ejemplo: un encargado con ciclo quincenal se representa como ['E', 'Q'].
 * El orden de `codes` es el orden de lectura: primero rol, luego ciclo.
 *
 * @param {string[]} codes
 * @param {number} [size=18]
 * @param {number} [gap=4] Separación en píxeles entre insignias.
 */
export default function BadgeGroup({ codes = [], size = 18, gap = 4, className = '' }) {
  if (!codes || codes.length === 0) return null;

  return (
    <span
      className={`inline-flex items-center flex-shrink-0 ${className}`}
      style={{ gap }}
    >
      {codes.map((code) => (
        <Badge key={code} code={code} size={size} />
      ))}
    </span>
  );
}
