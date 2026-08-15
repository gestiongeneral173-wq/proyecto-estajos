import { theme, alpha, width, space } from '../../lib/theme';

/**
 * BottomActionBar — barra fija al pie con la acción principal de la pantalla.
 *
 * Aloja una única acción, la más importante de la pantalla. El degradado
 * hacia el fondo evita el corte duro cuando el contenido pasa por debajo,
 * y el relleno inferior respeta la zona segura del dispositivo.
 *
 * Requiere que la pantalla use `<AppShell hasBottomBar>` para reservar el
 * espacio; de lo contrario tapa el último elemento de la lista.
 *
 * El botón que se pase dentro debe llevar `className="shadow-raised"`.
 */
export default function BottomActionBar({ children }) {
  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-20 pt-4 ${space.pageX}`}
      style={{
        paddingBottom: 'calc(0.9rem + env(safe-area-inset-bottom, 0px))',
        background: `linear-gradient(to top, ${theme.appBg} 68%, ${alpha(theme.appBg, 0)})`,
      }}
    >
      <div className={`${width.action} mx-auto`}>{children}</div>
    </div>
  );
}
