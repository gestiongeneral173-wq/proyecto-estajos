import { theme } from '../../lib/theme';

/**
 * CenteredScreen — pantalla de columna única centrada horizontalmente.
 *
 * Para pantallas sin navegación ni contenido desplazable: acceso por PIN,
 * carga, error de conexión. No lleva reglas responsivas y no las necesita
 * (Doc3 §12): su contenido tiene ancho fijo y nunca ocupa más del que pide.
 *
 * El hueco flexible entre el contenido principal y `footer` empuja el pie
 * al fondo de la pantalla sin recurrir a posicionamiento fijo.
 *
 * @param {React.ReactNode} [footer] Acción secundaria al pie. Ej.: "Acceso Central".
 */
export default function CenteredScreen({ footer, className = '', children }) {
  return (
    <div
      className={`min-h-screen flex flex-col items-center px-6 pt-20 pb-8 ${className}`}
      style={{ background: theme.appBg }}
    >
      {children}

      {footer && (
        <>
          <div className="flex-1" />
          <div className="flex flex-col items-center">{footer}</div>
        </>
      )}
    </div>
  );
}
