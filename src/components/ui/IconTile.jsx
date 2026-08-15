import { theme, neutral } from '../../lib/theme';

/**
 * IconTile — mosaico cuadrado con un icono centrado.
 *
 * Se usa como marcador visual al inicio de una fila o tarjeta
 * (una furgoneta, un tipo de movimiento). Es decorativo: el
 * significado siempre lo aporta el texto que lo acompaña.
 *
 * @param {React.ComponentType} icon Componente de icono de lucide-react.
 * @param {number} [size=28] Lado del mosaico en píxeles.
 * @param {'navy'|'gray'} [tone='navy']
 */
export default function IconTile({ icon: Icon, size = 28, tone = 'navy' }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.appBg,
      }}
    >
      <Icon
        style={{
          width: size * 0.5,
          height: size * 0.5,
          color: tone === 'gray' ? neutral : theme.navyMedium,
        }}
        strokeWidth={1.6}
      />
    </div>
  );
}
