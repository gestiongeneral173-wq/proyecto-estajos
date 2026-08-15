import { BADGES, theme } from '../../lib/theme';

/**
 * Badge — insignia individual de rol o de ciclo de pago.
 *
 * Roles (E, C, A, P, X): círculo de relleno sólido, letra blanca.
 * Ciclos de pago (Q, M): contorno, letra del color del ciclo.
 *
 * El tamaño no cambia entre dispositivos (Doc3 §11): la insignia
 * acompaña texto ya calibrado y crecer la desalinearía.
 *
 * @param {'E'|'C'|'A'|'P'|'X'|'Q'|'M'} code
 * @param {number} [size=18] Diámetro en píxeles.
 */
export default function Badge({ code, size = 18, className = '' }) {
  const meta = BADGES[code];
  if (!meta) return null;

  const esRol = meta.tipo === 'rol';

  return (
    <span
      title={meta.label}
      aria-label={meta.label}
      className={`cifra ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: esRol ? Math.round(size * 0.28) : 9999,
        background: esRol ? meta.color : 'transparent',
        border: esRol ? 'none' : `1px solid ${theme.line}`,
        color: esRol ? '#fff' : meta.color,
        fontSize: Math.round(size * 0.54),
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {code}
    </span>
  );
}
