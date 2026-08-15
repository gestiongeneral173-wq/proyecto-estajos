import { theme, alpha, type } from '../../lib/theme';

/**
 * Button — vocabulario de acción del sistema.
 *
 * Variantes de ancho completo: primary, dark, outline, danger, gold.
 * Variante compacta: pill (filtros y chips activables).
 *
 * Alturas (Doc3 §8.1): 48px en teléfono y tablet, 44px en computadora.
 * En pill: 36px y 32px. En computadora se reduce el tamaño pero se
 * añade `hover`, que compensa la pérdida de área táctil (Doc3 §8.2).
 *
 * @param {'primary'|'dark'|'outline'|'danger'|'gold'|'pill'} [variant='primary']
 * @param {React.ReactNode} [icon] Icono a la izquierda del texto.
 * @param {boolean} [active] Solo para `pill`: marca el chip como seleccionado.
 * @param {boolean} [full=true] Si es false, el botón se ajusta a su contenido.
 */
export default function Button({
  variant = 'primary',
  icon = null,
  active = false,
  disabled = false,
  full = true,
  className = '',
  onClick,
  type: htmlType = 'button',
  children,
  ...rest
}) {
  if (variant === 'pill') {
    return (
      <button
        type={htmlType}
        disabled={disabled}
        onClick={onClick}
        aria-pressed={active}
        className={`px-3.5 min-h-[36px] lg:min-h-[32px] rounded-lg ${type.body} font-medium
          whitespace-nowrap transition-colors active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
        style={
          active
            ? { background: theme.navyDark, color: '#fff' }
            : { background: 'transparent', color: theme.muted, border: `1px solid ${theme.line}` }
        }
        onMouseEnter={(e) => {
          if (!active && !disabled) e.currentTarget.style.background = theme.line;
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = 'transparent';
        }}
        {...rest}
      >
        {children}
      </button>
    );
  }

  const variants = {
    primary: { background: theme.primary, color: '#fff' },
    dark: { background: theme.navyDark, color: '#fff' },
    outline: { background: '#fff', color: theme.navyDark, border: `1px solid ${theme.line}` },
    gold: { background: theme.navyDark, color: '#fff' },
    danger: { background: '#fff', color: theme.danger, border: `1px solid ${alpha(theme.danger, 0.3)}` },
  };

  return (
    <button
      type={htmlType}
      disabled={disabled}
      onClick={onClick}
      className={`${full ? 'w-full' : ''} min-h-[48px] lg:min-h-[44px] px-4 rounded-lg
        ${type.control} font-medium flex items-center justify-center gap-2
        transition-all active:scale-[0.99] hover:brightness-[0.96]
        disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:brightness-100 ${className}`}
      style={variants[variant] || variants.primary}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
