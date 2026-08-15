import { space } from '../../lib/theme';

/**
 * ContentGrid — cuadrícula responsiva de tarjetas.
 *
 * Una columna en teléfono, dos en tablet, tres en computadora
 * (Doc3 §10.1), con separación creciente: 12 / 16 / 20 px.
 *
 * Solo para colecciones de elementos comparables entre sí. Para bloques
 * distintos apilados en vertical se usa `Section`.
 *
 * @param {2|3} [maxCols=3] Tope de columnas en computadora. Usar 2 cuando
 *        la tarjeta contiene una tabla y tres columnas la comprimirían.
 */
export default function ContentGrid({ maxCols = 3, className = '', children }) {
  const cols =
    maxCols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return <div className={`grid ${cols} ${space.gridGap} ${className}`}>{children}</div>;
}
