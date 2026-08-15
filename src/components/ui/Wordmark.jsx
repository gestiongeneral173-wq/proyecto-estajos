import { theme, type } from '../../lib/theme';

/**
 * Wordmark — logotipo tipográfico ESTAJOS.
 *
 * Tamaño fijo de 15px en los tres dispositivos: es un elemento de marca,
 * no de jerarquía, y no participa de la escala tipográfica (Doc1 §2.2).
 * Lo único que cambia es el interletrado según el contexto.
 *
 * @param {'lock'|'header'} [variant='header']
 *        lock   → tracking 0.3em, para la pantalla de acceso
 *        header → tracking 0.22em, para la cabecera de Central
 * @param {'h1'|'p'|'span'} [as='h1'] Usar 'h1' solo si es el título de la pantalla.
 */
export default function Wordmark({ variant = 'header', as: Tag = 'h1', className = '' }) {
  return (
    <Tag
      className={`font-semibold ${type.wordmark} leading-none ${className}`}
      style={{
        color: theme.navyDark,
        letterSpacing: variant === 'lock' ? '0.3em' : '0.22em',
      }}
    >
      ESTAJOS
    </Tag>
  );
}
