import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { theme, type } from '../../lib/theme';

/**
 * SearchInput — campo de búsqueda con icono de lupa y botón de limpiar.
 *
 * Es un filtro en vivo, no un formulario: escribe y la lista de abajo se
 * reduce. Por eso no lleva etiqueta visible ni botón de enviar.
 *
 * El anillo de foco usa `primary`, no el verde fijo de la maqueta.
 *
 * @param {string} value
 * @param {(valor: string) => void} onChange Recibe el texto, no el evento.
 * @param {string} [placeholder='Buscar']
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar',
  className = '',
  ...rest
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <Search
        className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: theme.muted }}
        aria-hidden="true"
      />

      <input
        type="search"
        role="searchbox"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full min-h-[46px] lg:min-h-[42px] pl-9 pr-9 bg-white border rounded-lg
          ${type.control} outline-none transition-colors`}
        style={{
          color: theme.navyDark,
          borderColor: focused ? theme.primary : theme.line,
        }}
        {...rest}
      />

      {value && (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center
            justify-center rounded active:scale-90 transition-transform"
          style={{ color: theme.muted }}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
