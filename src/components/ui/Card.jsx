import { theme } from '../../lib/theme';

/**
 * Card — contenedor blanco base de todo el sistema.
 *
 * Es la unidad visual mínima: fondo blanco, borde de 1px en `line` y
 * radio `rounded-xl`. No lleva sombra por defecto (Doc3 §10.2); se
 * apoya en el borde para separarse del fondo.
 *
 * @param {'none'|'compact'|'default'} [padding='default']
 *        none    → sin relleno, para tarjetas con tabla o lista interna
 *        compact → 12 / 16 / 16 px
 *        default → 20 / 20 / 24 px
 * @param {boolean} [interactive=false]
 *        Añade `hover` con elevación y reducción de escala al pulsar.
 *        Obligatorio si la tarjeta es clicable (Doc3 §10.2).
 */
export default function Card({
  padding = 'default',
  interactive = false,
  className = '',
  style = {},
  onClick,
  children,
  ...rest
}) {
  const paddings = {
    none: '',
    compact: 'p-3 sm:p-4',
    default: 'p-5 lg:p-6',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border ${paddings[padding]}
        ${interactive ? 'cursor-pointer transition-all hover:shadow-sm active:scale-[0.99]' : ''}
        ${className}`}
      style={{ borderColor: theme.line, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
