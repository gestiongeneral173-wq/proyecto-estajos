import { theme, type, width, space } from '../../lib/theme';

/**
 * TabBar — navegación horizontal entre secciones.
 *
 * Se mantiene el patrón de pestañas con desplazamiento lateral en los
 * tres dispositivos (Doc2 §6); no se sustituye por un menú lateral en
 * computadora.
 *
 * Correcciones aplicadas respecto a la maqueta:
 * - Comparte ancho máximo con el contenido principal, para quedar
 *   alineada verticalmente con él en computadora (Doc2 §3.1).
 * - Las pestañas inactivas tienen estado `hover`, que antes no existía
 *   y dejaba la barra sin respuesta al cursor (Doc3 §8.2).
 *
 * @param {{key: string, label: string, icon?: React.ComponentType}[]} items
 * @param {string} value Clave de la pestaña activa.
 * @param {(key: string) => void} onChange
 * @param {string} [label='Secciones'] Nombre accesible de la barra.
 */
export default function TabBar({ items, value, onChange, label = 'Secciones' }) {
  return (
    <nav
      aria-label={label}
      className="bg-white border-b sticky top-0 z-20"
      style={{ borderColor: theme.line }}
    >
      <div className={`flex overflow-x-auto pb-2.5 gap-1 mx-auto ${width.content} ${space.pageX}`}>
        {items.map(({ key, label: texto, icon: Icon }) => {
          const activa = value === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              aria-current={activa ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3 min-h-[34px] lg:min-h-[32px] rounded-lg
                ${type.body} whitespace-nowrap font-medium flex-shrink-0 transition-colors`}
              style={activa ? { background: theme.primary, color: '#fff' } : { color: theme.muted }}
              onMouseEnter={(e) => {
                if (!activa) e.currentTarget.style.background = theme.line;
              }}
              onMouseLeave={(e) => {
                if (!activa) e.currentTarget.style.background = 'transparent';
              }}
            >
              {Icon && <Icon className="w-[15px] h-[15px]" strokeWidth={1.8} />}
              {texto}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
