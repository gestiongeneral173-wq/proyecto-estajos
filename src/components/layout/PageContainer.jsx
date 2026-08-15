import { width, space } from '../../lib/theme';

/**
 * PageContainer — centra el contenido y le da su ancho máximo y su relleno.
 *
 * Aplica los tres anchos del sistema (Doc2 §3.1) y el relleno de página
 * responsivo (Doc2 §3.2). Ningún componente debe escribir `max-w-*` ni
 * `px-*` de página por su cuenta: se pasa por aquí.
 *
 * @param {'content'|'form'|'action'} [size='content']
 *        content → listados y pantallas de exploración: 448 / 672 / 896
 *        form    → flujos de formulario: 448 / 576 / 576 (no crece más)
 *        action  → barras de acción y hojas: 448 / 384 / 384
 * @param {boolean} [padX=true] Relleno horizontal de página.
 * @param {boolean} [padTop=false] Relleno superior del contenido principal.
 * @param {'div'|'main'|'section'} [as='div'] Usar 'main' en el contenido principal.
 */
export default function PageContainer({
  size = 'content',
  padX = true,
  padTop = false,
  as: Tag = 'div',
  className = '',
  children,
}) {
  return (
    <Tag
      className={`mx-auto w-full ${width[size]} ${padX ? space.pageX : ''}
        ${padTop ? space.pageTop : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
