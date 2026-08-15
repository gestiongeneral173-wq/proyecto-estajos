import { theme, type } from '../../lib/theme';

/**
 * Eyebrow — etiqueta corta en mayúsculas que encabeza una sección.
 *
 * Da ritmo tipográfico: toda tarjeta y todo bloque se abren igual,
 * sin importar su contenido. 10px en teléfono y tablet, 11px en
 * computadora — crece muy poco a propósito (Doc1 §2.2).
 *
 * @param {'h2'|'h3'|'p'} [as='h2'] Etiqueta HTML, según la jerarquía real.
 * @param {boolean} [spaced=true] Margen inferior de 16px.
 */
export default function Eyebrow({ as: Tag = 'h2', spaced = true, className = '', children }) {
  return (
    <Tag
      className={`${type.eyebrow} ${spaced ? 'mb-4' : ''} ${className}`}
      style={{ color: theme.muted }}
    >
      {children}
    </Tag>
  );
}
