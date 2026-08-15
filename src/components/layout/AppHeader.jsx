import { ArrowLeft, LogOut } from 'lucide-react';
import { theme, type } from '../../lib/theme';
import Wordmark from '../ui/Wordmark';

/**
 * AppHeader — barra superior fija de la aplicación.
 *
 * Una sola cabecera para las dos superficies. Respeta la zona segura
 * superior del dispositivo (`env(safe-area-inset-top)`), imprescindible
 * en teléfonos con muesca.
 *
 * @param {string} [title='ESTAJOS'] Título de la pantalla.
 * @param {string} [subtitle] Contexto secundario. Ej.: "Central".
 * @param {boolean} [wordmark=false]
 *        Sustituye el título por el logotipo. Solo en pantallas raíz de
 *        cada superficie; en pantallas de detalle se usa el título real.
 * @param {() => void} [onBack] Muestra la flecha de volver.
 * @param {() => void} [onLogout] Muestra el botón Salir a la derecha.
 * @param {React.ReactNode} [right] Acciones extra antes del botón Salir.
 */
export default function AppHeader({
  title = 'ESTAJOS',
  subtitle,
  wordmark = false,
  onBack,
  onLogout,
  right,
}) {
  return (
    <header
      className="px-3 flex items-center justify-between sticky top-0 z-30 bg-white border-b"
      style={{
        borderColor: theme.line,
        paddingTop: 'calc(0.55rem + env(safe-area-inset-top, 0px))',
        paddingBottom: '0.55rem',
      }}
    >
      <div className="flex items-center gap-1 min-w-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="w-10 h-10 flex items-center justify-center rounded-lg -ml-1
              hover:bg-gray-50 active:scale-90 transition-all"
            style={{ color: theme.navyMedium }}
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
          </button>
        )}

        <div className={`min-w-0 ${onBack ? '' : 'ml-2'}`}>
          {wordmark ? (
            <Wordmark />
          ) : (
            <h1
              className={`font-semibold ${type.subtitle} tracking-tight truncate`}
              style={{ color: theme.navyDark }}
            >
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="text-[11px] truncate mt-0.5" style={{ color: theme.muted }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {right}

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className={`flex items-center gap-1.5 px-3 min-h-[36px] lg:min-h-[32px] rounded-lg
              ${type.body} font-medium hover:bg-gray-50 active:scale-95 transition-all`}
            style={{ color: theme.muted }}
          >
            <LogOut className="w-[15px] h-[15px]" />
            Salir
          </button>
        )}
      </div>
    </header>
  );
}
