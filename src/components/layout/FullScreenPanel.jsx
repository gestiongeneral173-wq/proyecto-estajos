import { width } from '../../lib/theme';

/**
 * FullScreenPanel — panel superpuesto a pantalla completa.
 *
 * Es la presentación de los flujos de varios pasos: cubre la pantalla
 * dejando ver el contenido anterior desenfocado en el margen superior,
 * lo que mantiene la sensación de "sigo dentro de la misma pantalla".
 *
 * En computadora no crece más allá de 576px (Doc2 §3.1): un formulario
 * más ancho pierde legibilidad.
 *
 * Bloquea el desplazamiento del fondo mientras está abierto.
 *
 * @param {boolean} open
 * @param {string} title Nombre accesible del panel.
 * @param {React.ReactNode} [header] Cabecera fija, normalmente un `AppHeader`.
 */
export default function FullScreenPanel({ open, title, header, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className={`flex-1 flex flex-col mt-10 sm:mt-16 rounded-t-3xl overflow-hidden
          shadow-sheet mx-auto w-full ${width.form}`}
        style={{
          background: 'transparent',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
        }}
      >
        {header}
        {children}
      </div>
    </div>
  );
}
