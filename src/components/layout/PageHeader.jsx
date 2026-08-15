import { theme, type } from '../../lib/theme';

/**
 * PageHeader — bloque de encabezado del contenido de una pantalla.
 *
 * No confundir con `AppHeader`: aquel es la barra fija del navegador de
 * la app; este es el titular que abre el contenido, y se desplaza con él.
 *
 * Estructura fija: etiqueta pequeña, título grande, línea de contexto.
 * Ese orden es el ritmo de lectura del sistema y no debe alterarse.
 *
 * @param {string} eyebrow Categoría de la pantalla. Ej.: "Parte del día".
 * @param {string} title Titular. Ej.: "Hoy · 3 de agosto de 2026".
 * @param {React.ReactNode} [meta] Línea de contexto bajo el título.
 * @param {React.ReactNode} [action] Control alineado a la derecha del título.
 * @param {React.ReactNode} [below] Enlace secundario. Ej.: "← Volver a hoy".
 */
export default function PageHeader({ eyebrow, title, meta, action, below, className = '' }) {
  return (
    <div className={`mb-6 ${className}`}>
      {eyebrow && (
        <p className={type.eyebrow} style={{ color: theme.muted }}>
          {eyebrow}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 mt-1.5">
        <h1
          className={`${type.display} font-semibold tracking-tight leading-none`}
          style={{ color: theme.navyDark }}
        >
          {title}
        </h1>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      {meta && (
        <p className={`${type.body} mt-2.5`} style={{ color: theme.muted }}>
          {meta}
        </p>
      )}

      {below && <div className="mt-2">{below}</div>}
    </div>
  );
}
