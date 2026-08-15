import { theme } from '../../lib/theme';

/**
 * AppShell — envoltorio de pantalla completa.
 *
 * Fija el fondo `appBg` y la altura mínima de viewport. Es el primer
 * elemento de toda pantalla de nivel superior; sin él, el fondo blanco
 * del navegador se ve por debajo del contenido corto.
 *
 * @param {boolean} [hasBottomBar=false]
 *        Reserva 112px al pie para que la última tarjeta no quede
 *        tapada por `BottomActionBar`.
 * @param {'app'|'flow'} [surface='app'] `flow` usa el fondo del flujo de registro.
 */
export default function AppShell({
  hasBottomBar = false,
  surface = 'app',
  className = '',
  children,
}) {
  return (
    <div
      className={`min-h-screen ${hasBottomBar ? 'pb-28' : ''} ${className}`}
      style={{ background: surface === 'flow' ? theme.chatBg : theme.appBg }}
    >
      {children}
    </div>
  );
}
