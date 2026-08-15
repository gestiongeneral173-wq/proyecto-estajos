import { useState } from 'react';
import { theme, type } from '../../lib/theme';

/**
 * Input — campo de formulario estándar, con etiqueta tipo eyebrow.
 *
 * Unifica todos los formularios del sistema. Altura de 46px en teléfono
 * y tablet, 42px en computadora (Doc3 §9).
 *
 * Corrección aplicada respecto a la maqueta: el borde de foco usaba un
 * verde fijo de Tailwind (`focus:border-emerald-600`) que rompía la
 * paleta del tema. Aquí el foco usa el token `primary` (Doc1 §1.3).
 *
 * @param {string} [label] Etiqueta sobre el campo. Si se omite, pasar `aria-label`.
 * @param {string} [hint] Texto de apoyo bajo el campo.
 * @param {string} [error] Mensaje de error; sustituye a `hint` y tiñe el borde.
 * @param {boolean} [mono] Fuerza tipografía monoespaciada (importes, horas).
 */
export default function Input({
  label,
  hint,
  error,
  mono = false,
  id,
  className = '',
  style = {},
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const inputId = id || (label ? `campo-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  const borderColor = error ? theme.danger : focused ? theme.primary : theme.line;

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className={`${type.eyebrow} block mb-2`}
          style={{ color: theme.muted }}
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        className={`w-full min-h-[46px] lg:min-h-[42px] px-3.5 bg-white border rounded-lg
          ${type.control} ${mono ? 'cifra' : ''} outline-none transition-colors ${className}`}
        style={{ color: theme.navyDark, borderColor, ...style }}
        {...rest}
      />

      {(error || hint) && (
        <p className="text-[11px] mt-2" style={{ color: error ? theme.danger : theme.muted }}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
