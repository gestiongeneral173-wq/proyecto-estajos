import { space } from '../../lib/theme';
import Eyebrow from '../ui/Eyebrow';

/**
 * Section — bloque de contenido con encabezado y espaciado vertical propio.
 *
 * Agrupa elementos que pertenecen al mismo asunto dentro de una pantalla
 * larga. Aplica el espaciado entre bloques del sistema (16 / 16 / 20 px).
 *
 * Si el bloque solo contiene una tarjeta, no hace falta esta capa: se usa
 * `Eyebrow` dentro de la propia `Card`.
 *
 * @param {string} [title] Se renderiza como Eyebrow.
 * @param {React.ReactNode} [action] Control a la derecha del título.
 * @param {boolean} [stack=true] Aplica separación vertical entre hijos.
 */
export default function Section({ title, action, stack = true, className = '', children }) {
  return (
    <section className={className}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-2">
          {title && <Eyebrow as="h2" spaced={false}>{title}</Eyebrow>}
          {action}
        </div>
      )}

      <div className={`${title || action ? 'mt-3' : ''} ${stack ? space.stack : ''}`}>
        {children}
      </div>
    </section>
  );
}
