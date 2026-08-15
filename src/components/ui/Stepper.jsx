import { theme, type } from '../../lib/theme';

/**
 * Stepper — barra de progreso con etiqueta por paso.
 *
 * Encabeza cualquier flujo de varios pasos. Cada paso ocupa el mismo
 * ancho y se colorea según su estado: completado (`primary`), actual
 * (`navyDark`) o pendiente (`line`, con la etiqueta atenuada).
 *
 * La numeración no se muestra: las etiquetas ya nombran el paso, y el
 * número sería redundante.
 *
 * @param {string[]} steps Etiquetas en orden. Ej.: ['Furgoneta','Equipo','Enviar'].
 * @param {number} current Paso activo, empezando en 1.
 */
export default function Stepper({ steps, current, className = '' }) {
  return (
    <ol
      className={`flex items-end gap-2 pb-1 ${className}`}
      aria-label={`Paso ${current} de ${steps.length}`}
    >
      {steps.map((label, i) => {
        const n = i + 1;
        const completado = n < current;
        const actual = n === current;

        return (
          <li key={label} className="flex-1" aria-current={actual ? 'step' : undefined}>
            <p
              className={`${type.eyebrow} mb-1.5 truncate`}
              style={{
                color: actual ? theme.navyDark : completado ? theme.primary : theme.muted,
                opacity: actual || completado ? 1 : 0.6,
              }}
            >
              {label}
            </p>
            <div
              className="h-1 rounded-full transition-colors"
              style={{
                background: completado ? theme.primary : actual ? theme.navyDark : theme.line,
              }}
            />
          </li>
        );
      })}
    </ol>
  );
}
